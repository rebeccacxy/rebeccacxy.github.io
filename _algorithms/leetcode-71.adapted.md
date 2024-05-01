---
title: Leetcode 71. (Adapted) Change Working Directory
excerpt: 'Change Working Directory'
toc: true
---

## Problem Description

Problem ID: [71](https://leetcode.com/discuss/interview-question/553454/Facebook-or-Phone-or-Change-Working-Directory/485967)

Given the current working directory (pwd) and change directory path (cd), output the absolute path by cd from pwd.

Example:
```bash
Current (pwd)       Change (cd)         Output

/ 				     foo 		    	 /foo
/baz 				 /bar 			     /bar
/foo/bar 			 ../../../../.. 	 /
/x/y 				 ../p/../q 			 /x/q
/x/y 				 /p/./q 			 /p/q
/					 /					 /
```

#### Difficulty
Medium

<br/>

## Thoughts

Need to be careful about edge cases here. 

## Solution

### Explanation

**Edge cases:** 
- If change (cd) starts with `/` (eg.`/p/q`), we ignore the current path and go to path in change directly.
- If change (cd) == `/`, return `/` (include this condition in return statement) 
- If change (cd) is null, return the current directory

Use a stack approach. If change (cd) does not start with `/`, then prefill the stack with the current directory (pwd), then process the change.

**Time:** O(N)
**Space:** O(N)

### Implementation

```java
public String simplifyPath(String current, String change) {
    if (change == null) {
        return current;
    }
    if (change.charAt(0) == '/') {
        current = "";
    }

    String separator = "/";
    String currentDir = ".";
    String previousDir = "..";

    Deque<String> stack = new ArrayDeque<>();
    String[] currentComponents = current.split(separator);
    for (String directory : currentComponents) {
        if (!directory.isEmpty()) {
            stack.push(directory);
        }
    }
    String[] changeComponents = change.split("/");

    for (String directory : changeComponents) {
        if (directory.isEmpty() || directory.equals(currentDir)) {
            continue;
        }

        if (directory.equals(previousDir)) {
            if (!stack.isEmpty()) {
                stack.pop();
            }
        } else {
            stack.push(directory);
        }
    }

    StringBuilder path = new StringBuilder();
    Iterator<String> iterator = stack.descendingIterator(); // reverse stack
    while (iterator.hasNext()) {
        path.append(separator);
        path.append(iterator.next());
    }
    return path.length() > 0 ? path.toString() : separator; // when cd is "/"
}
```
