---
title: Leetcode 162. Find Peak Element
excerpt: 'Find Peak Element'
toc: true
---

## Problem Description

Problem ID: [162](https://leetcode.com/problems/find-peak-element/)

A peak element is an element that is strictly greater than its neighbors.

Given an integer array nums, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.

You may imagine that `nums[-1] = nums[n] = -∞`.

You must write an algorithm that runs in O(log n) time.

#### Difficulty
Medium

<br/>

## Solution

### Explanation

**Edge case:** Empty array

Binary search. When the left and right pointer meet at the same element, that element is the peak.

**Time:** O(log N)
**Space:** O(1)

### Implementation

```cpp
int findPeakElement(vector<int>& nums) {
	int low = 0, high = nums.size() - 1;
	while (low < high) {
		int mid = low + (high - low) / 2;
		if (nums[mid] < nums[mid + 1]) {
			low = mid + 1;
		} else {
			high = mid;
		}
	}
	return low;
}
```
