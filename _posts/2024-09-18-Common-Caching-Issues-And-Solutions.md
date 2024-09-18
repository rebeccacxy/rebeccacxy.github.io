---
title: "Caching challenges at scale"
categories:
  - Post
tags:
  - server
excerpt: "Common caching issues and solutions"
toc: true
---


## Simple cache model

- read: find data in cache. If cache miss, query to DB and set back to cache (if DB found) — cache aside / look aside strategy
- update: update DB first, then delete data in cache (write invalidate strategy)
- pain point resolved: reduce read traffic to DB, improve performance
    - but write become more expensive (caching may not be suitable for write-heavy services)

## In-memory cache

Types of caches to reduce network traffic:

1. Thread scope cache (for current request, doesn’t affect other request) — won’t pollute in-process cache & data consistency during the request’s lifetime
2. In-process cache (using heap space / global variable, no I/O)
3. Redis / memcached on the same container (can be shared between multiple processes, using I/O) 

Examples of in-memory caches:
1. syncMap
2. Ristretto


## Cache Performance Issues

**Issue 1: Single cache server can not serve traffic**

- if key_size grow and QPS grow, single cache server cannot handle traffic, need to scale up

**Issue 2: Hot key issue**

- whole cache overall performance is ok, but single key (single server) performance is slow / troublesome / high QPS

**Issue 3: Introduce multilayer cache to solve cache performance issues**

- bottleneck for remote cache server is I/O, network, so use in-memory cache to get rid of that

### Issue 1: Cache key & traffic growing

challenge: single cache server, bottleneck usually is I/O throughput and network bandwidth

- 1 single memcached can handle 200,000+ QPS
- 1 single redis can handle 50,000 QPS
—> so 1 single cache server not possible to serve huge traffic (millions of QPS) = bottleneck at cache layer


**Solution:**

- can add more cache servers (horizontal scale)
- distribute the cache traffic & cache item among these cache servers
  - use sharding rule (shard the cache_key) to detect which cache_server a cache_item belongs to. If 10 cache instances, `cache_server_index = hash_crc32(cache_key) % 10`
- where to put sharding logic?
  - client-side
    - pros: logic is simple, easy to implement, flexible to customize complex sharding logic
    - cons: scaling number of cache servers is too much work:
      - need to reshard cache_key (by updating sharding rule)
      - double write data for cache migration (for old sharding rule and new sharding rule)
  - using proxy between client & servers: using load balancer (as a proxy between client and cache server) to perform sharding / routing
    - pros: sharding logic is easy to scale, extra features can be implemented at proxy (load balancer) layer, eg. hotkey detection, disaster recovery
    - cons: commands set is limited (commands that need data across multiple instances not  supported), performance will decrease (due to extra proxy layer)
        

### Issue 2: Hot key
Challenge: after splitting keys to different cache servers, some server has higher traffic than other servers because it contains hotter cache items, eg. flash sale products have higher traffic

![Hotkey.jpg](/assets/images/hotkey.jpg)

**Solution for hotkey handling:**
- create more replicas of hotkey to distribute the traffic of hotkey
- to create more replicas, append hotkey suffix to the hotkeys
  - eg. hot cache item is `item_A`, create 5 replica keys `item_A_0, item_A_1, ... item_A_4`
  - replica keys have different hash —> distributed to different cache server
  - note: for update / invalidate requests, need to update / invalidate all the replicas
- how to detect which keys are hot?
  - cannot blindly apply to all keys, otherwise will cause performance drop / key size increase not necessary
  - **client-side hotkey detection:**
    - exact match: suitable if we know which keys are hot
    - pattern match: suitable if we know which key patterns are hot
    - customized hotkey checker function (called everytime for every key):
      - for dynamically-detected hotkeys in flash sale, can asynchronously call API to get list of flash sale products, treat these products as hotkeys
      - note: if need to call other services for hotkey checker, should async call the services instead of making RPC call everytime for every key
      - pros: easy to implement, feature supported in ucache library
      - cons: can’t always detect which cache keys are hot, single application instance not enough data to detect hotkey of whole service
  - **server-side hotkey detection:**
    - server side can detect which keys are hot at proxy (load balancer) layer for the whole service

- **Multilayer cache to boost cache performance**
  - challenge: bottleneck of remote cache usually is I/O throughput and network bandwidth, latency & Bigkey (large data)
  - solution: create another cache in same process and use it as first layer cache
    
    
  - `GET`: get from local cache first, if not search upper layer. set back data to first layer
  - `UPDATE / DELETE`: update / delete for all layers
  - trade-off between performance and data consistency

### How to improve cache performance

- horizontal scaling by adding more cache servers
- create more replicas for hotkey
- using multilayer cache

But above techniques introduce more dependencies —> how to ensure data consistency between these dependencies?

## Data consistency issues

What causes this issue:
- Read operation much faster than write operation so probability of this situation is low
- happens when: Request A triggers GC and stop the world, causes delay for Read operation

**Solution:** for Update operation, instead of invalidating cache, update the cache (write through)

- pros: higher cache hit ratio (because data always available in cache)

![Screenshot 2024-09-05 at 5.42.53 PM.png](/assets/images/Screenshot_2024-09-05_at_5.42.53_PM.png)

what causes this issue:
- 2 parallel cache update operations, order of execution NOT expected


**Solutions for updating the cache (write-through)**

can ensure order by:

- **distributed lock** to lock whole DB & cache
- **atomic CAS (compare & swap) operation** with version check

| Invalidate cache data                                        | Update cache data                                            |
|--------------------------------------------------------------|--------------------------------------------------------------|
| Pros:<br>- ensure data consistency<br>- delete operation is idempotent and can replay easily | Pros:<br>- data more available in cache (higher cache hit)   |
| Cons:<br>- more cache miss —> cause more traffic to DB       | Cons:<br>- stale cache can happen more regularly (due to parallels update)<br>- update operation not idempotent —> hard to replay the failed traffic |
  

### Issue 1: Database data-sync to slave DB has delay —> stale cache

MySQL master-slave model has the common practice:
- master DB: serve update queries
- slave DB: serve read queries
- MySQL binlog used to sync data between master db and slave db —> can have high delay time


**How to solve slave delay:**
- add delay for update / invalidate cache request — doesn’t fully solve the issue
- DB should be source of truth, so cache should only be updated after DB committed successfully
- DB will produce binlog after insert / update./ delete operation and order of messages is ensured
- How about create another pipeline script to listen to slave DB binlog

**Solution: cache invalidate / update pipeline**
- pros:
  - pipeline script is customizable, easy to add features
    - double invalidate:
      - master DB binlog to invalidate data early and make cache data faster
      - slave DB binlog to solve slave DB delay issue
    - add delay time (which iis higher than the highest slave DB delay)
  - eventually consistent (when cache server unstable)
    - eg. retry, replay failover requests
  - more use cases: invalidate cache because data change from upstream services
    - eg. Item_bass store item_info in its cache for faster retrieval, but the place which manages item info is in item_info service
      - item_bass deletes its cache if item_info service has data change
- cons:
  - cache stale longer time
  - higher latency because more components involved
  - another script to develop and maintain

### Issue 2: Multilayer cache data cache inconsistency

Challenge: in-memory cache not aware of remote cache data change, so data in-memory won’t be invalidated

**Solution:** 
- **simplest (recommend):** set low expiration for in-memory cache (we tolerate stale cache)
- **performance trade-off:** can use kafka to broadcast the update-event to other instances (or consume GDS) to invalidate in-memory cache


## **Cache Availability issues**

1. Freshness of cache item & high hit rate
    - keeping cache_item freshness is critical for many services
    - keeping high hit rate can protect and reduce traffic to DB
2. Single point of failure cause cascading failure
    - since is SPOF, if 1 cache server crash / unstable, whole service goes down and can cause cascading failure
3. Cache stampede cause DB overload
    - goes against purpose of cache protecting DB

### Issue 1: Freshness of cache item & high hit rate

**Goal:** want high cache hit rate, reduce load to DB. cache_data should be as fresh as possible

**Challenge:** 
- if set **higher expiration time** for higher hit rate, lower data consistency & more memory usage
- if use **update cache strategy** for higher hit rate, data inconsistency issue in parallel update cases

**Solution 1: add header to cache_item to include more metadata

- hard timeout: if reach, remove items from cache (same as expiration)
- soft timeout: if reach, fetch data from database and refresh data in cache
  - after reload data, need to update new soft timeout / hard timeout to the new fetched cache item
- note: can only check soft timeout for a cache when receive GET request for that cache
  - which means should not create a goroutine to scan all keys and check soft timeout
- Cons:
  - data size bigger because now we append metadata to cache item
  - can still have cache miss if data past its expiration time if cache_item has not received any GET request
    - if cache_item is big (but low frequency), then loading data from DB after miss is expensive


**Solution 2: Preloading data (Refresh ahead strategy)**
- To ensure data always present in cache (never blocking reads), create an async goroutine to periodically load data from database and set to cache
- **Cons:**
  - limited use case as this approach requires us to know which cache keys need to preload.
    - key size should be small, best for small read-only dataset
- Use cases:
  - For Shopee’s listings category, can periodically refresh whole cache since key size is small and category data rarely changed

### Issue 2: Single point of failure
**Challenge:** If single cache server is down and service return many errors, can cause cascading failure

Bad idea: if cache down, pass traffic to read from DB
- will make DB overload, make everything worse

<img src="/assets/images/SPOF.png" alt="SPOF" width="450"/>

**Solution:** create more replicas for cache servers
- memcached HA: self controlled traffic
  - read from random replica node
  - set / del apply to all replicanodes
  - this feature already supported in memcached HA & ucache
- proxy layer automatic failover to replica nodes
  - process is transparent to client

note: data inconsistency issues after “down node” is recovered

### Issue 3: Cache stampede

challenge: occurs when several goroutines attempt to access a same cache_key in parallel

- if cached value doesn’t exist, all goroutines will attempt to fetch data from DB / api at the same time —>  overload DB

**Solution:** only goroutine A should query the DB and broadcast the result to goroutine B & C

- achieve this using monitors

![Screenshot 2024-09-06 at 12.17.19 PM.png](/assets/images/Screenshot_2024-09-06_at_12.17.19_PM.png)

- For handling cache stampede across instances, use distributed lock to ensure that only 1 instance has permission to query from DB
    - Cons: key size increases, performance can worsen if blindly use it
    - goal is mostly protect DB, so suitable if DB is cold-storage DB, which can take seconds / minutes to execute the query
    - cache stampede handling feature supported in ucache

Follow up: previous idea can reduce traffic for parallels getting a key. If there are parallels getting multiple keys, DB can still be overloaded

- eg. DDoS hacking by sending huge traffic with non-existent user_ids —> all user_ids are different and cache_miss —> all requests go to DB —> overload DB

To protect DB and avoid cascading failure, use unified resilience library to implement retry, timeout, rate limiter, circuit breaker

### Issue 4: Shared Cache issue

- When the same cache server is shared across multiple regions but using the same datacenter
- Multiple regions can write to / fetch from same key and override each other

![Screenshot 2024-09-19 at 12.48.32 AM.png](/assets/images/Screenshot 2024-09-19 at 12.48.32 AM.png)

**Solution:**
- allows the setting of a user-defined cache key prefix, used during cache initialization, applies to all incoming keys
  - cache key format: `{env}.{cid}.{prefix}.{original_key}`
    - use `cid` to differentiate countries

### How to increase cache hit rate
- increase size of cache server and increase expiration time to avoid cache eviction
- using soft-timeout to load data before it expires and preloading valuable cache data
- using cache update strategy instead of cache invalidation strategy