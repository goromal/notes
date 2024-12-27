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

**[THE PYTHON EXAMPLES](https://github.com/goromal/scratchpad/blob/master/optimizations/ceres_tutorial.ipynb)**

## Some Slides

As some end matter, here are some PDF slides I put together to present the above tutorial in a lab setting. The per-slide notes are also included, for reference.

**[THE SLIDES](https://andrewtorgesen.com/res/Ceres_Slides.pdf)**

### Ceres Solver (Title Slide)

- Popular tool for solving “back-end” estimation and SLAM problems with nonlinear least squares
  - Made more accessible for rapid prototyping and for those not as comfortable with C++
- Hopefully useful particularly for those starting out and wanting to get real exposure to implementing and solving problems like SLAM without a huge coding learning curve
- Or even for experienced users who want a fast prototyping tool
- Will go over some theory (not a lot of detail) to give context to the solver, explain why Ceres is awesome, then solve a toy SLAM problem with python bindings (and a little bit of C++)

### Ceres Solver: Overview

- So how do you solve estimation and SLAM problems with Ceres, and what special features does it offer?
  - A brief delving into estimation theory will help clarify those questions.

### Estimation as Nonlinear Optimization

- Bayesian inference:
  - in scenarios where you have probabilistic models for
    - how your system (robot) state evolves (if at all) through time
    - how your observations relate to your state
  - …you can express your state as the one that maximizes the joint probability over all of your models, which are expressed in terms of residuals, which quantify the agreement between your state belief and what the models are telling you about your state
  - nice when your models are Gaussian; you can express them analytically and concisely in terms of covariance and residuals
- In practice, solved with filtering or optimization (smoothing)
  - Smoothing → access to entire history, unlike with filtering
- When you can, go with optimization! It gives you more accuracy gains per unit of computation time.

### Estimation as Nonlinear Optimization

- So the process of finding the most likely state (and state history) of your robot is reduced to this nonlinear least-squares optimization over the residuals of all of your models through time
  - Been mentioning state, but this includes optimizing over environmental attributes (e.g., landmarks) as with bundle adjustment and SLAM

### Nonlinear Optimization on the Manifold

- Local search will treat \\(\mathbf{x}\\) as a vector, and it will leave the manifold as soon as you add or subtract.
- Retractions allow you to move along the manifold using vectors.

### Ceres Solver: Features

- With theoretical backdrop, now we can appreciate everything Ceres has to offer.
- Jet usage requires sound knowledge of C++ templating, as we'll see.

### Ceres vs GTSAM

- GTSAM serves many of the same needs–how do they stack up?
- Incremental optimization with ISAM2 probably GTSAM's biggest advantage.
- Auto-differentiation and level of support are Ceres' biggest advantages.

### Toy Problem: PGO

- Find the maximum-likelihood sequence of robot poses given a series of front-end (VIO) measurements and sparse loop closure measurements.
- We'll simulate the system and solve the problem all in Python.
  - I took some unfinished Python bindings for Ceres and “finished” them, to allow rapid prototyping and learning for myself and others.
- First, we'll define local parameterization and cost function in C++ (which will are then wrapped in Python) for speed and to illustrate how templating for auto-differentiation works with Ceres.
- Ceres will give us the Jacobians of the local parameterization and residuals for free!

### Toy Problem: Local Parameterization

- The actual math is only one line! The rest is handling templates and pointers.

### Toy Problem: Residual Definition

### Toy Problem: Dynamics and Covariances

- Everything from here on out is in Python
- Dynamics: Euler integration using this local perturbation vector in position and orientation (will move forward and yaw, creating a circle)
- Covariance and square root matrices

### Toy Problem: True State + Odom Simulation

1. Instantiate the problem.
2. Fixed noisy prior no state at the beginning, then subsequently noisy relative odometry measurements.
3. The Euler integration itself relies on the implemented SE3 geodesic map definitions.
4. Each time a measurement is created, add local parameterization (so Ceres knows this isn't part of a vector space) as well as residual definition.
