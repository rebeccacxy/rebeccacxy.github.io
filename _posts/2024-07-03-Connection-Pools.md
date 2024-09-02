---
title: "Connection Pools"
categories:
  - Post
tags:
  - server
excerpt: "Connection Pools - A deep dive"
---

# Connection Pools - A deep dive
I came across connection pools when working on a task to support many concurrent server requests. After doing a stress test, I realized the huge impact it has on performance even when I was testing on just 1000 concurrent users. Creating a single connection is inexpensive, but at scale, it can get expensive quickly. 

## The Problem
Let’s consider a web scenario where we have a frontend server communicating with a backend server. Each time the frontend wants to communicate with the backend, it has to open a new connection. 
If we have 1000 concurrent requests per second, we would need to be tearing down and establishing 1000 new connections each second. 

## The Solution - Connection Pool
Connection pooling can be applied to any connection, like TCP, database and redis connections. It allows us to efficiently manage these connections. 

The connection pool allows a minimum set of connections with the server to be kept alive. Instead of opening a new connection with the server each time a request is made, the controller calls a `Get()` function to obtain an existing connection from the pool. Once communication between the controller and the server ceases, the connection is released to the pool via a `conn.Close()` call. 
![connection-pool](/assets/images/connection-pool.png)

This alleviates the overhead of tearing down a connection and opening a new connection by reusing existing connections. 
With the use of mutexes or buffered channels, the connection pool should be thread-safe to prevent race conditions.


## Tuning the connection pool
**`MaxIdleConnection`**
> The maximum number of connections in the idle connection pool
If n <= 0, no idle connections are retained

**`MaxIdleTime`**
> The maximum amount of time a connection may be idle
If d <= 0, connections are not closed due to a connection's idle time

**`MaxOpenConns`**
> The maximum number of connections that can be active per address at any given time
When the server experiences a sudden increase in latency, more connections will be created, which further worsens the situation.
`MaxOpenConns` helps by capping the number of connections created.


TODO: add code
