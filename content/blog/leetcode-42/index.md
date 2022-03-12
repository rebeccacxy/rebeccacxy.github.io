---
title: Leetcode 42. Trapping Rain Water
date: '2022-03-12T12:00:00.00Z'
description: 'Compute how much water an elevation map can trap'
---

## Problem Description

Problem ID: [42](https://leetcode.com/problems/trapping-rain-water/)

Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

#### Difficulty
Hard

<br/>

## Solution

### Explanation

**Edge case:** If empty array, return 0. If < 3 bars, return 0.

2 pointer approach. Find longest bar on left and right, and maintain leftMax and rightMax during iteration.

**Example input:** `[6,0,5,0,4]`

- Longest bar on left = 6, right = 5 --> can hold 5 water
- At index 3, longest bar on left = 6, right = 4 --> cannot hold water 
- At index 4, longest bar on left = 6, right = 4 --> can hold 4 water
- Total = 5 + 4 = 9 water

**Time:** O(N)
**Space:** O(1)

### Implementation

```cpp
int trap(vector<int>& height) {
    if (height.size() < 3) { // edge case
    	return 0;
    }
    int left = 0, right = height.size() - 1; // 2 pointers
    int leftMax = 0, rightMax = 0; 
    int ans = 0;

    while (left < right) {
    	rightMax = max(rightMax, height[right]);
    	leftMax = max(leftMax, height[left]);
    	if (height[left] < height[right]) {
    		ans += leftMax - height[left++];
    	} else {
    		ans += rightMax - height[right--];
    	}
    }
    return ans;
}
```
