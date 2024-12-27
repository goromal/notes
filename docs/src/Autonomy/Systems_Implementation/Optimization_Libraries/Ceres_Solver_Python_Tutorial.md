# Ceres Solver Python Tutorial

## Ceres Introduction


The [Ceres Solver](http://ceres-solver.org/) is Google's powerful and extensive C++ optimization library for solving:

  - general unconstrained optimization problems
  - nonlinear least-squares problems with bounds (not equality!) constraints.

The second application is particularly useful for perception, estimation, and control in robotics (perhaps less so for control, depending on how you implement dynamics constraints), where minimizing general nonlinear measurement or tracking residuals sequentially or in batch form is a common theme. This is further facilitated by Ceres' support for optimizing over vector spaces as well as Lie Groups, much like GTSAM. To zoom in on the comparison between the two libraries a bit, here are some relative pros and cons:

| Ceres Advantages                                                                                                                                        | GTSAM Advantages                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Supported by Google, not just one research lab                                                                                                          | Made specifically for robotics applications, so comes with a lot of useful tools, such as... |
| Has an awesome [automatic differentiation system](http://ceres-solver.org/automatic_derivatives.html)--no time wasted computing complicated derivatives | ...iSAM2 incremental optimization                                                            |
| Generalizes well beyond robotics applications, or even exotic robotics applications that don't yet have pre-programmed tools                            | ...Marginalization support (e.g., for fixed-lag smoothing)                                   |

Aside from what's mentioned in the table, GTSAM adopts the helpful [factor graph](http://deepdive.stanford.edu/inference) modeling paradigm for estimation problems. If desired, Ceres can be used through the definition of factors as well, as will be shown in the examples below. All in all, Ceres is a fine choice for solving optimization-based inference problems, and it's not going away any time soon. Moreover, the [docs](http://ceres-solver.org/) are thorough and well-made; this tutorial can be thought of as an entry point to give some context to a deep-dive into the documentation.

## Solving Problems with Ceres

At a minimum, a Ceres program for solving [nonlinear least-squares problems](../../Search_and_Optimization/Nonlinear_Optimization.md) requires the following specifications:

  * A `Problem()` object.
  * For every decision variable (`parameter`) that isn't a vector:
    * Add a `LocalParameterization()` object to the problem using the function `AddParameterBlock()`.
  * For every residual in the problem:
    * Add a `CostFunction()` object (can be thought of as a factor in factor graph lingo) with the relevant parameters using the function `AddResidualBlock()`

See the examples below to get a sense of how these objects and functions are used in practice, particularly in the context of robotics problems.
## Automatic Differentiation in Ceres

One of the main selling points of Ceres is its powerful automatic differentiation system. As covered in the articles on [Nonlinear Least-Squares](../../Search_and_Optimization/Nonlinear_Optimization.md) and [Lie Group Optimizations](../../Search_and_Optimization/Optimization_Over_Lie_Groups.md), local search requires Jacobian definitions for, at a minimum:

  - The cost function \\(J\\) or residual \\(r\\).
  - The \\(\oplus\\) operator of the parameter vector *if* it exists on a manifold, because of the chain rule.

Thus, any user declaration of a class that inherits from [CostFunction](http://ceres-solver.org/nnls_modeling.html#costfunction) or [LocalParameterization](http://ceres-solver.org/nnls_modeling.html#localparameterization) requires the specification of Jacobians. This can get really tedious really fast, which is why Ceres offers auto-diff in the form of two alternative classes to define through templating and inheritance (see the links for details):

  - [AutoDiffCostFunction](http://ceres-solver.org/nnls_modeling.html#_CPPv4N5ceres20AutoDiffCostFunctionE): A templated class that takes as an argument a user-defined "functor" class or struct implementing the residual function.
  - [AutoDiffLocalParameterization](http://ceres-solver.org/nnls_modeling.html#autodifflocalparameterization): A templated class that takes as an argument a user-defined "plus" class or struct implementing the \\(\oplus\\) operator.


## Small Robotics Examples with Ceres (in Python)

Ceres is a C++ library, and its speed is certainly dependent on programming in that language. That said, I've found it useful to use Python bindings to learn the library by doing quick experiments solving small-scale robotics problems. 

The Jupyter notebook below contains some illustrative examples of Ceres applied to small robotics problems of increasing complexity--they should give a sense of what the library is capable of, and perhaps even facilitate your own prototyping efforts. The Python syntax translates pretty well to C++, but of course the [Ceres website](http://ceres-solver.org/tutorial.html) serves as the best C++ API reference.

**[THE PYTHON EXAMPLES](TODO)**

## Some Slides

As some end matter, here are some PDF slides I put together to present the above tutorial in a lab setting. The per-slide notes are also included, for reference.

**[THE SLIDES](TODO)**

***TODO***
