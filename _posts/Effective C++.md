---
title: "Post: C++ vs Python"
categories:
  - Post
tags:
  - Programming Language
excerpt: "A comparison of C++ and Python"
---

## Item 1: View C++ as a federation of languages
C++ can be broken down into C, OOP, Template C++, STL

## Item 2: Prefer consts, enums and inlines to #defines
When using #define, the compiler will replace the reference to the macro with the defined value
### Declaring constants with `define`
- for simple constants, prefer const objects or enums to #define
Cons:
- the macro may not get entered into the symbol table. Error may refer to the value, not the macro name, causing confusion
- preprocessor will create a copy of the value each time the macro is referenced —> less efficient 

Solution: use `const double Pi = 3.14` instead of `#define Pi 3.14`
Advantages:
- this is sure to be seen by compilers and entered to symbol tables
- use of const may yield smaller code than #define. Only one copy will be generated

### Defining constant pointers
- as constant definitions are usually in header file, where many different source files will include them, **pointer** must be declared const in addition to the value it points to
```cpp
const char *const name = "Scott"
```

### Declaring class-specific constants
- make constants `static`member —> to limit scope of a constant to a class, and ensure there is at most 1 copy
  ```cpp
  class MyClass {
  private:
  	static const double Pi = 3.14;
  ```

### Inline function
- for function-like macros, use inline functions instead of #define
  - able to make the inline function private to a class (can’t do that with #define as it doesn’t respect scope, or you have to undefine it )

## Item 3: Use `const` whenever possible
### const pointer
If const appears to the left of *, what's pointed to is constant. If const appears to the right of *, the pointer is constant. 
- `const char *p`: when const is on the left of pointer —> data is const. Can change pointer, but not what the pointer is pointing to
  ```cpp
  int i = 1, j = 2;
  const int *ptr = &i;
  *ptr = 3; // compilation error
  ptr = &i; // ok
  ```
- `char *const p`: when const is on the right of pointer —> pointer is const. Can change value that the pointer is pointing to, but cannot change the variable to a new pointer
  ```cpp
  int i = 1, j = 2;
  int *const ptr = &i;
  *ptr = 3; // ok
  ptr = &j // compilation error
  ```
  
### Iterator 
- STL iterator acts like a T* pointer
- const iterator == T* const pointer: the iterator cannot be changed to a new iterator, but its value can be changed
- const_iterator == const T* pointer: the iterator can be changed to a new iterator, but its value cannot be changed

### const member functions
- use `const` member functions to identify which member functions should be invoked on const / non-const objects
  - make interface of a class easier to understand
  - make it possible to work with const objects
    - passing objects by reference-to-const improves performance (item 20)
- functions can be overloaded using const (for const / non-const objects)
- what does it mean for a member function to be const? 
  - bitwise constness: `const T obj`
    - bitwise const object cannot have its bits modified
    - if it is not bitwise const, even if the member function is marked as const, the object’s internal state can still be modified
  - logical constness: `int getData() const {...}`
    - declaring a reference or pointer const, and is enforced by the compiler
    - the object may / may not be bitwise const, but the reference cannot be used to modify it without a cast
- use `mutable` to allow the class member to be modified in const member functions
  - examples of this: mutex that must be locked during a read operation, and a cache to store the result of an expensive read operation
  - can be abused to make the object visibly change when it logically should not — only declare members mutable if they don't form part of the externally visible state
  ```cpp
  mutable bool lengthIsValid;
  
  std::size_t length() const {
  	if (!lengthIsValid) {
  		lengthIsValid = true; // ok
  	}
  }
  ```

- avoid code duplication in const and non-const member functions by casting non-const `*this` to `const *this`

## Item 4: Ensure objects are initialized before they’re used
**Order of initialization**:
- base class initialized before dervied class
- within a class, data members initialized in the order they are declared

**Use member initialization list over assignments**: for most types, a single call to a copy constructor is more efficient than a call to the default constructor followed by a call to the copy assignment operator
- arguments in the initialization list are used as constructor arguments for the data members, eg. `theName` is copy constructed from `name`
- avoids wasting work done from default constructing

### Static objects
- exist from the time it is constructed until end of program
- do not exist on stack or heap
- destroyed when the program exists (destructor is called when `main` finishes executing)
- translation unit: source code that gives rise to a single object file (has all the #include files)

### Non-local static objects in different translation units
- Relative order is undefined
  - to prevent this, replace non-local static objects with local static objects — initialize the local static object in a function that returns a reference to it, aka a reference-returning function (Singleton pattern)
  - this guarantees that the static object is always initialized
  - if you never call the `tfs` function, won’t incur the cost of constructing and destructing the object (unlike non-local static objects)  

  ```cpp
  class FileSystem {
  public: 
    FileSystem& tfs() {
      static FileSystem fs;
      return fs;
    }
    std::size_t numDisk() const;
  }
  extern FileSystem tfs;

  class Directory {
  public:
    Directory(params) {
      std::size_t disks = tfs().numDisks();
    }
  }
  Directory tmpDir(params);
  ```

Cons:
- problematic for multithreading — need to call the reference-returning function in master thread before forking child thread so that the child thread has the same reference
  - how to eliminate initialization-related race conditions: invoke all reference-returning functions during the single-threaded startup portion of the program 

## Item 5: Know what functions c++ silently writes and calls
- by default, compiler generates default constructor, copy constructor, copy assignment operator and destructor

## Item 6: Explicitly disallow the use of compiler-generated functions you don’t want
If want to disable the compiler from generating copy assignment constructor, can:
1. Declare as private and don’t define it
2. Set it private in base class —> compilation error when trying to inherit from it

## Item 7: Declare destructors virtual in polymorphic base classes
Problem with non-virtual destructor:
- If a pointer to a derived class is cast to a base class, only the base class dtor is called, not the derived class dtor —> data members of base class are destructed, but not data members of derived class —> memory leak
- **Solution: Use virtual destructor for all base classes**

How virtual function works:
- Objects need to store information at runtime to determine which virtual method to be called
- Each object has a vptr that points to a vtable (array of function pointers)
- Each vtbl will point to a function to be invoked
- Cons: 
  - Space overhead of storing vptr and vtable
  - C language lacks vptr: objects are unportable to other languages
- declare a virtual destructor in a class iff that class contains at least one virtual function

## Item 8: Prevent exceptions from leaving destructors
- C++ discourages destructors from throwing exceptions, as they can result in multiple active exceptions (eg. destructing a vector of objects) —> undefined behaviour
- To prevent this, abstract it out into a public function to let clients call and handle. If client didn’t call it successfully, execute it in the destructor but catch all the exceptions (prevent UB)

## Item 9: Never call virtual functions during construction or destruction
- Base class parts of derived class objects are constructed before derived class parts
- during base class construction, virtual functions don’t point to derived classes. Object behaves as if it is of base type
  - base class constructors run before derived class constructors —> only base class data members are initialized — derived class data members may not be initialized yet —> UB
- an object doesn’t become a derived class object until execution of a derived class constructor begins
- same for destruction

If pure virtual function:
- Link error — base class calls the undefined pure virtual function
- can bypass link error by calling the pure virtual function in another non-virtual function

In general, use a helper function to create a value to pass to a base class constructor. Making it static also prevents data members from being in an undefined state.

## Item 10: Have assignment operators return a reference to `*this`
All assignment operators should return a reference to the current object using `*this`
- allows us to chain assignment operators `x = y = z = 15`
  - which is actually `x=(y=(z=15))`

## Item 11: Handle assignment to self in `operator=`
Indirect ways of potential self-assignment:
- different pointer to same reference
  ```cpp
  a[i] = a[j]
  *px = *py 
  ```
- base class reference or pointer points to an object of derived class type

Cost of self assignments:
- makes code (source & object) larger
- introduces a branch into the flow of control
- decreases runtime speed

### **Self assignment problem**: deleting self will also delete rhs
#### Implementing `operator=`
Unsafe in presence of assignment to self:
```cpp
Widget& Widget::operator=(const Widget& rhs) {
	delete pb;	pb = new Bitmap(*rhs.pb); // rhs.pb is already deleted
	return *this; 
}
```

Not exception safe:
```cpp
Widget& Widget::operator=(const Widget& rhs) {
	if (this == &rhs) return *this;
	delete pb;	pb = new Bitmap(*rhs.pb); // if exception is thrown here, pb points to a deleted addr
	return *this; 
}
```
Instead, should place `delete pb` only after we copied what it points to
```cpp
Widget& Widget::operator=(const Widget& rhs) {
	Bitmap *pOrig = pb;	pb = new Bitmap(*rhs.pb); 
	delete pOrig; // only delete after pb points to a valid addr
	return *this; 
}
```

### Copy-And-Swap 
Copy-And-Swap is a better alternative to manually ordering statements in `operator=` to make it exception-safe and self-assignment-safe.

Make a copy of `rhs` and swap it with the current object
```cpp
Widget& Widget::operator=(const Widget& rhs) {
	Widget temp(rhs); // make a copy of rhs data
	swap(temp); // swap *this data with the copy's
	return *this;
}
```

## Item 12: Copy all parts of an object
- Only copy constructor and copy assignment operator should copy objects
- All local data members should be initialized in the copy constructors
- Derived class copy functions must invoke the base class ones too, or else the base class data members won’t be initialized

Bad practices:
- don’t call copy constructor from copy assignment
- don’t call copy assignment from copy constructor

If copy constructor and copy assignment operator have similar code bodies, eliminate code duplication by putting common functionality in a third `init` function 

## Item 13: Use objects to manage resources
tldr: RAII
Use objects to manage heap based resources instead of raw pointers

**Drawbacks of using raw pointers**
- forgetting to deallocate memory will cause memory leak
- deallocation might not happen when there is early return, exception or break in a loop

### RAII (Resource Acquisition is Initialization)
- Object’s destructor will be called once it goes out of scope
- Tying a resource to an object allows destructor of the object to clean up the resource

### Smart pointers
Limitations: Only uses `delete` not `delete[]` in destructor
- If the resource is a dynamically allocated array, only the first pointer is deleted. 
- Compiles but leads to UB

### **shared_ptr**
- everytime the object is copied or assigned, shared reference count increases 
- calls destructor once shared ref count becomes 0
- Limitations: can’t break cyclic references —> shared ref count never becomes 0
  - Solution: use weak pointer instead

## Item 14: Think carefully about copying behaviour in resource-managing classes
TODO