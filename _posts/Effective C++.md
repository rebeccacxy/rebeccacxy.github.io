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

Item 14: Think carefully about copying behaviour in resource-managing classes
If one wants to implement their own RAII, need to handle copying behaviour
- Prohibit copying
  - For mutex, resource (Lock) should not be copied —> declare copying operations private
  ```cpp
  class Lock : private Uncopyable // prohibit copying
  ```
- Reference-count the underlying resource
  - change the type to a `shared_ptr`
    - but `shared_ptr` default behaviour deletes the object when reference count goes to zero. 
    - If object is a Mutex, want to unlock it, not delete it
    - Instead, provide `shared_ptr` with a **deleter** function (called when ref count goes to zero —> cause `shared_ptr` to call the deleter function instead of destructor
- Copy the underlying resource
  - can have multiple copies of an object —> use deep copy (copy both the pointer and the memory it points to)
- Transfer ownership of the underlying resource

## Item 15: Provide access to raw resources in resource- managing classes
To access underlying heap-based resource from an RAII object:
- Explicit conversion
  - provide a `raii.get()`member function to get underlying resource
  - overloading pointer reference `operator->` — literally all smart ptr classes overload `operator->` and `operator*`
  - safer than implicit conversion
- Implicit conversion
  - allow casting from raii object to the underlying resource pointer
  - allow clients to easily use API that need the resource pointer
    ```cpp
    Font f;
    operator FontHandle() const { // overload casting operator
    	return f;
    }
    void doSomething(FontHandle r) {}
    Font f;
    doSomething(f) // implicitly casts Font to FontHandle 
    ```
  - Cons: can accidentally cast from Font to the underlying resource

In general, explicit conversion is safer than implicit conversion, as it minimizes the chances of unintended type conversions

## Item 16: Use the same form in corresponding uses of `new` and `delete`
### What happens when you call `new`?
1. allocate memory via operator `new`
2. call constructors 
3. initialize fields
4. return pointer

### What happens when you call `delete`?
1. call destructor
2. delete memory via operation `delete`

**Heap memory layout:**
Single object: | Object |
Array: | n | Object | Object | Object |

- `delete[]`: assumes the first `k` bytes to be size of the array, destructor will be called on the next contiguous `n` location in memory
  - if using `[]` in `new`, must also use `[]` in matching `delete`
- `delete:`deletes the address for the size of the array and part of the first object

## Item 17: Store newed objects in smart pointers in standalone statements
When using smart pointers, want to ensure there’s no memory leaks, by making sure no exceptions are thrown between allocating memory and calling constructors.

In C++, compiler can reorder evaluations of arguments
```cpp
processWidget(shared_ptr<Widget>(new Widget), func());
```
need to perform it in the order:
- call `new`
- call constructor of`shared_ptr`
- call `func()`

but compiler can reorder it to:
- call `new` 
- call  `func()`
- call constructor of `shared_ptr`
If `func()` throws exception, pointer returned by`new Widget` will cause memory leak, as it won’t be stored in`shared_ptr`which should clean it up
- Solution: use a separate statement to store `new` object in smart pointer —> guarantees no exceptions will be thrown 
  ```cpp
  shared_ptr<Widget> w(new Widget);
  processWidget(w, func()); // this call won't leak
  ```
  - now, `new Widget` and call to `shared_ptr` constructor are in a different statement from `func()`, so compiler can’t reorder 

## Item 18: Make interfaces easy to use correctly and hard to use incorrectly
- Use strongly typed parameters
  - eg. wrapper types to distinguish days, months, years to pass into a Date constructor
- return `const` to prevent invalid assignment
- return smart ptr that calls delete
  - can define custom deleter for `shared_ptr` to prevent cross DLL problem

## Item 19: Treat class design as type design
Class design is type design. Before defining a new type, consider all the issues discussed in this Item
eg. if defining a new derived class just to add functionality to an existing class, maybe it’s better to define non-member functions / templates

## Item 20: Prefer pass-by-reference-to-const to pass-by-value
By default, C++ passes objects to / from functions by value
### Pass-by-value
- Call copy constructor of base class and all its data members. Initialize function parameters with copies of the actual arguments
- Cons:
  - expensive operation (also need to destroy copies)
  - Slicing problem: when derived class object is passed by value as a base class object, base class copy constructor is called
- Exceptions:
  - Built-in-types — same overhead as passing by reference, as same amount of data would be passed
  - same for iterators and function objects in STL
  - for these, pass-by-value is appropriate, as

### Pass-by-reference-to-const
- passing a pointer as an argument to the function
- use `const` to enforce immutability on the argument
- prevents slicing problem

## Item 21: Don’t try to return a reference when you must return an object
Object created on the stack by function:
- Don’t return a reference to a local object, as local objects are destroyed when the function exits, and the reference that the function returns will point to an object that’s destroyed —> UB

Object created on the heap by function:
- don’t know who calls `delete` —> memory leak

## Item 22: Declare data members private
not c++ specific
- affords fine-grained access control, allows invariants to be enforced
- encapsulation: to easily change implementation of data member

## Item 23: Prefer non-member non-friend functions to member functions
**Drawbacks of member functions:**
- reduces encapsulation
- when importing a class, forced to import all utility functions instead of the necessary ones

**Use non-member, non-friend functions**
- reduces compilation dependencies
  - put all related functions in multiple header files under a single namespace — easily extendable for more non-member non-friend functions
```cpp
// header “webbrowser.h” — header for class WebBrowser itself
class WebBrowser {
// core functionality
};
// header “bookmarks.h” 
namespace WebBrowserStuff { // bookmarks convenience functions
}
// header “cookies.h” 
namespace WebBrowserStuff { // cookies convenience functions
}
```

## Item 24: Declare non-member functions when type conversions should apply to all parameters

**How type conversion works:**
- Given a type T1 and need to construct an object of type T2 from object of type T1, type conversion works if there is conversion from `T1 -> T2`
- If T2 has a constructor that accepts a T1 object `T2(T1)`, then a temporary T2 object can be constructed from T1. This allows implicit / explicit conversion from `T1 -> T2`
- Provide T2 as an argument to the object’s constructor

**How operators work:**
- For operators (`*`, `+`…), the compiler first looks for valid operator overloads within the class scope (member operators) and then in the namespace scope (non-member operators) if a matching member operator is not found
- type conversion will be used if the operator is not `explicit`

**Implicit type conversion**
- parameters are eligible for implicit type conversion only if they are listed in the parameter list
- for operators that should perform implicit type conversion, use non-member functions so that both the parameters can be converted

## Item 25: Consider support for a non-throwing swap
As long as types support copying (copy constructor, copy assignment operator), default swap will work
- but inefficient, copies 3 objects 
```cpp 
// std::swap
templace<typename T> 
void swap(T& a, T& b) {
	T temp(a);
	a = b;
	b = temp;
}
```

**More efficient custom swap:**
1. Public swap member function 
   - should never throw an exception — as many operations rely on swap operations to prevent memory leak
2. Non-member swap in same namespace as class / tempalate. Have it call your swap member function
   - can throw exceptions — copy constructor and copy assignment in default swap are allowed to throw exceptions
3. If writing a class, specialize `std::swap` for your class. Have it call your swap member function

## Item 26: Postpone variable definitions as long as possible
- defer variable definition as much as possible
  - avoid unnecessary default constructions if exception is thrown / function returns before it is used
  - ```cpp
    string s;
    if (...) throw exception;
    // define here instead
    ```
- don’t define a variable with default constructor then assign it to a new value later
  - prevents an extra call to the constructor and copy assignment — better to just have a single call to the copy constructor
  - ```cpp
    // extra call to constructor and copy assignment
    string s;
    s = "hello";
    f(s);
    
    // vs
    string s("hello") // single call to copy constructor
    ```

## Item 27: Minimize casting
Types of casting:
- C-style: `(T) expression`
- Function-style: `T(expression)`
- C++ style:
  - `const_cast<T>(expression)` — only cast that can cast away constness of objects
  - `dynamic_cast<T>(expression)` — for safe downcasting, on what you believe to be a derived class object, but only have a pointer / reference-to-base 
  - `reinterpret_cast<T>(expression)` — low-level, eg. casting a pointer to an int. Don’t use this if possible
  - `static_cast<T>(expression)` — for forcing implicit conversions (eg. non-const to const, int to double)
- Prefer C++ style casts to the first two casts — easier to see, more specific 

Cons of casting:
- Casting a pointer of derived class to base class can cause overhead of getting the base class pointer
  - In C++ (not applicable to other langauges), an object of type Derived can have more than 1 address (ie. address pointed to by a `Base*` ptr and address pointed to by a `Derived*` ptr
  ```cpp
  Derived d;
  Base* b = &d; // implicitly converts Derived* --> Base*
  // b != d
  ```
- For `static_cast`, when casting derived object to base object, will create a temporary copy of the base object, then invoke the function on the copy
  - Solution: Eliminate the cast. Instead, call the base class function directly `Base::f()` in the derived class function
- `dynamic_cast` is slow, under the hood it performs string matching to class name. Instead of `dynamic_class`:
  1. Use containers that store pointers (smart pointers) to derived class objects directly, to eliminate the need to manipulate such objects through base class interfaces
  2. Use a base class interface to provide virtual functions in the base class

## Item 28: Avoid returning “handles” to object internals
Returning references, pointers, and iterators can potentially compromise an object’s encapsulation. 
- can lead to `const` member function that allow an object’s state to be modified
- can lead to dangling handles, if a temporary object is created and only the handle is assigned to a variable —> temp object is destroyed but handle left dangling

## Item 29: Strive for exception-safe code
An exception-safe function will:
- leak no resources
- don’t allow data structures to become corrupted

Must offer one of the 3 guarantees:
- Basic guarantee: if an exception is thrown, everything in the program remains in a valid state
- Strong guarantee: if an exception is thrown, state of the program is unchanged
- Nothrow guarantee: never throw exceptions

## Item 30: Understand the ins and outs of inlining
Inlining is a request to compilers, implicitly or explicitly, to replace each call of that functionw ith its code body
- is a compile-time activity, so usually in header files

Implicit: define a function inside a class definition
Explicit: use `inline` keyword

Won’t work on complicated functions (contains loops / recursive), most virtual functions (since they wait until runtime to determine what function to call)

> Use inlining on small, frequently called  functions

**Pros**
- for small functions, can lead to smaller object code and higher instruction cache hit rate

**Cons**
- increases space overhead of programs 
  - even with virtual memory, large functions can lead to additional paging, reduced instruction cache hit rate, poor performance
- constructors and destructors have long functions to construct data members under the hood — not ideal for inlining
- if a library uses inline function `f`, all clients that use `f` must recompile, instead of just relinking a non-inline function
