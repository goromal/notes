# Implementing Rotations: A Robotics Field Guide

***Why?***

My aim here is to elucidate the complex machinery that constitutes the hard part of working with transforms and frames in robotics: rotations and rotational representations. 

Even when working with a pre-existing software library that provides rotational representations for you, there are so many different conventions (and the implications of those conventions, often mixed together, so ingrained in the math) that without thorough documentation on the part of the library (good luck), you're bound to be banging your head against the wall at some point. Sometimes, even understanding exactly what the functions are giving you can give you pause. 

*This guide is meant to be a one-stop-shop for concisely clarifying the possibilities and helping you recognize which ones you're working with and their implications. Some convenient calculators that conform to your chosen conventions are also provided.*


I've implemented many of these concepts in a [C++ library](https://github.com/goromal/manif-geom-cpp) with corresponding [Python bindings](https://github.com/goromal/geometry). There's also a [Python script](https://gist.github.com/goromal/fb15f44150ca4e0951acaee443f72d3e) that implements the checks laid out in this guide for deducing the rotational conventions used by a particular library.

## Introduction: Conventions

Often ignored or omitted from documentation are the hidden conventions associated with a rotation representation implementation--particularly implementations that allow for converting between different representations. But conventions are very important to get right in order to ensure consistency and correctness, as well as prevent needless hours of debugging. This guide attempts to aggregate most, if not all, possible conventions for the various representations in one place. Here are the types of conventions relevant to rotational representations:

  * **Ordering:** Pure semantics--in what order are the components stored in memory and notationally?
  * **Handedness:** This convention is a catch-all for intrinsic properties that determine the geometry of compositions.
  * **Function:** Does the rotation serve to change the reference frame of a vector (Passive) or *move* the vector (Active) by its action? Note that in computer graphics, active functions are more common, whereas in robotics rotations almost always are meant to be passive. The one nuance is when library definitions associate quaternions with rotation matrices in such a way that it looks like the quaternion is acting as an active counterpart to its corresponding passive rotation matrix--more on that later.
  * **Directionality:** A rotation is relative--the rotation of frame \\(A\\) relative to frame \\(B\\). Directionality determines which of \\(A\\) or \\(B\\) is the frame being rotated *from* and *to*. In robotics, the canonical \\(A\\) and \\(B\\) frames are often labeled as \\(W\\) (the "World" frame) and \\(B\\) (the "Body" frame). The “World” and “Body” frames are only semi-arbitrary. Regardless of conventions, it is natural to think of a rotation intuitively as going from some “static (World)” frame to some “transformed (Body)” frame.
  * **Perturbation:** Only relevant for representations that have defined addition \\(\oplus\\) and subtraction \\(\ominus\\) operators and thus tangent-space vector aliases. Perturbation convention determines which tangent space (or "frame") the vector belongs to. The convention is largely up to your preference, and isn't specifically tied to the other conventions used--you just have to be consistent within your algorithm!

The table below gives most, if not all, of the possible convention combinations for the rotational representations used in this guide.

|                        | Ordering (**O**)                 | Handedness (**H**)      | Function (**F**) | Directionality (**D**) | Perturbation (**P**) |
| ---------------------- | -------------------------------- | ----------------------- | ---------------- | ---------------------- | -------------------- |
| Rotation Matrix        |                                  |                         | Active / Passive | B2W / W2B              | Local / Global       |
| Euler Angles           | 3-2-1 / 3-2-3 / 3-1-3\\(^{*}\\)  | Successive / Fixed Axes | Active / Passive | B2W / W2B              |                      |
| Rodrigues / Axis-Angle |                                  |                         | Active / Passive | B2W / W2B              |                      |
| Quaternion             | \\(q_w\\) first / \\(q_w\\) last | Right / Left            | Active / Passive | B2W / W2B              | Local / Global       |

\\(^{*}\\) There are really \\(3^3\\) possible orderings of Euler Angles, though a good portion of those are redundant. The three chosen conventions in the table were chosen as (1) NASA standard airplane, (2) NASA standard aerospace, and (3) historically significant.

Two very popular convention groups for quaternions are called the **Hamilton** and **Shuster/JPL** conventions. This table will also include the conventions used by some members of my lab:

|               | Ordering (**O**)       | Handedness (**H**) | Function (**F**) | Directionality (**D**) |
| ------------- | ---------------------- | ------------------ | ---------------- | ---------------------- |
| Hamilton      | \\(q_w\\) first / last | Right              | Passive          | B2W                    |
| Shuster / JPL | \\(q_w\\) last         | Left               | Passive          | W2B                    |
| My Lab        | \\(q_w\\) first        | Right              | Active           | W2B                    |

See Table 1 of the [Flipped Quaternion Paper](https://arxiv.org/abs/1801.07478) for an overview of literature and software that use the Hamilton and Shuster / JPL conventions.

## Introduction: Notions of Distance

A distance metric \\(\text{dist}(a,b)\\) must satisfy the following properties:

  * *non-negativity*: \\(\text{dist}(a,b) \geq 0\\)
  * *identity*: \\(\text{dist}(a,b)=0 \iff a=b\\)
  * *symmetry*: \\(\text{dist}(a,b) \geq \text{dist}(b,a)\\)
  * *triangle inequality*: \\(\text{dist}(a,c) \leq \text{dist}(a,b) + \text{dist}(b,c)\\)

There are many possible choices depending on analytical/computational convenience, particularly for rotations. A good review of metrics can be found in *R. Hartley, J. Trumpf, Y. Dai, and H. Li. Rotation averaging. IJCV, 103(3):267-305, 2013.*.

## Rotation Matrix

### Construction Techniques

**From Frame Axes \\(A\\) & \\(B\\)**

> F = Passive:

$$\mathbf{R}_A^B=\begin{bmatrix}^B\mathbf{x}_A & ^B\mathbf{y}_A & ^B\mathbf{z}_A\end{bmatrix}$$

> F = Active:

See *F = passive*, where \\(A\\) is the source frame and \\(B\\) is the destination frame.

**From Rotation \\(\theta\\) about n-Axis from World to Body**

  * 1 and 0's on the n-dimension
  * Cosines on the diagonal
  * Sines everywhere else...

> D = B2W:

  * ...Negative sine **underneath** the 1

> D = W2B, F = Passive:

  * ...Negative sine **above** the 1

> D = W2B, F = Active:

  * ...Negative sine **underneath** the 1

### Conversions (To...)

**Euler Angles**

*Assuming 3-2-1 ordering, H = Successive.*

> D = B2W:

$$\phi=\text{atan2}(R_{32},R_{33}),\quad\theta=-\arcsin(R_{31}),\quad\psi=\text{atan2}(R_{21},R_{11})$$

> D = W2B, F = Passive:

$$\phi=\text{atan2}(R_{23},R_{33}),\quad\theta=-\arcsin(R_{13}),\quad\psi=\text{atan2}(R_{12},R_{11})$$

> D = W2B, F = Active:

Same matrix form as D = B2W, so:

$$\phi=\text{atan2}(R_{32},R_{33}),\quad\theta=-\arcsin(R_{31}),\quad\psi=\text{atan2}(R_{21},R_{11})$$

Singularity at \\(\theta=\pm\pi/2\\) (gimbal lock). For H = Fixed, reverse the multiplication order in the underlying matrix construction; extraction then proceeds from the transposed matrix structure.

**Rodrigues**

*i.e., the SO(3) logarithmic map*.

> D = B2W:

$$\theta=\cos^{-1}\left(\frac{\text{trace}(\mathbf{R})-1}{2}\right)$$ 

if \\(\theta\neq 0\\):

$$\theta\mathbf{u} = Log(\mathbf{R}) = \frac{\theta(\mathbf{R}-\mathbf{R}^T)^\vee}{2\sin(\theta)}$$ 

else:

$$\theta\mathbf{u} = Log(\mathbf{R}) = \mathbf{0}$$

Alternatively, \\(\mathbf{u}\\) can be thought of as the eigenvector of \\(\mathbf{R}\\) that corresponds to the eigenvalue \\(1\\).

> D = W2B, F = Passive:

Same formula applied to \\(\mathbf{R}\_W^B\\):

$$\theta\mathbf{u} = Log(\mathbf{R}) = \frac{\theta(\mathbf{R}-\mathbf{R}^T)^\vee}{2\sin(\theta)}$$

Since \\(\mathbf{R}\_W^B=(\mathbf{R}\_B^W)^T\\), the result is the negation of the B2W Rodrigues vector: \\(Log(\mathbf{R}\_W^B)=-Log(\mathbf{R}\_B^W)\\).

> D = W2B, F = Active:

Same formula and result as D = B2W, since the W2B active rotation matrix is identical to the B2W passive rotation matrix.

**Quaternion**

> D = B2W:

\\(\delta=\text{trace}(\boldsymbol{R})\\)

if \\(\delta>0\\) then

\\(s=2\sqrt{\delta+1}\\)

\\(q_w=\frac{s}{4}\\)

\\(q_x=\frac{1}{s}(R_{32}-R_{23})\\)

\\(q_y=\frac{1}{s}(R_{13}-R_{31})\\)

\\(q_z=\frac{1}{s}(R_{21}-R_{12})\\)

else if \\(R_{11}>R_{22}\\) and \\(R_{11}>R_{33}\\) then

\\(s=2\sqrt{1+R_{11}-R_{22}-R_{33}}\\)

\\(q_w=\frac{1}{s}(R_{32}-R_{23})\\)

\\(q_x=\frac{s}{4}\\)

\\(q_y=\frac{1}{s}(R_{21}+R_{12})\\)

\\(q_z=\frac{1}{s}(R_{31}+R_{13})\\)

else if \\(R_{22}>R_{33}\\) then

\\(s=2\sqrt{1+R_{22}-R_{11}-R_{33}}\\)

\\(q_w=\frac{1}{s}(R_{13}-R_{31})\\)

\\(q_x=\frac{1}{s}(R_{21}+R_{12})\\)

\\(q_y=\frac{s}{4}\\)

\\(q_z=\frac{1}{s}(R_{32}+R_{23})\\)

else

\\(s=2\sqrt{1+R_{33}-R_{11}-R_{22}}\\)

\\(q_w=\frac{1}{s}(R_{21}-R_{12})\\)

\\(q_x=\frac{1}{s}(R_{31}+R_{13})\\)

\\(q_y=\frac{1}{s}(R_{32}+R_{23})\\)

\\(q_z=\frac{s}{4}\\)

> D = W2B, F = Passive:

Same Shepperd extraction as D = B2W, applied to \\(\mathbf{R}\_W^B\\). Since \\(\mathbf{R}\_W^B=(\mathbf{R}\_B^W)^T\\), this yields \\(\mathbf{q}\_W^B=(\mathbf{q}\_B^W)^{-1}\\). Equivalently, using the B2W quaternion components directly:

\\(\delta=\text{trace}(\boldsymbol{R})\\)

if \\(\delta>0\\) then

\\(s=2\sqrt{\delta+1}\\)

\\(q_w=\frac{s}{4}\\)

\\(q_x=\frac{1}{s}(R_{32}-R_{23})\\)

\\(q_y=\frac{1}{s}(R_{13}-R_{31})\\)

\\(q_z=\frac{1}{s}(R_{21}-R_{12})\\)

else if \\(R_{11}>R_{22}\\) and \\(R_{11}>R_{33}\\) then

\\(s=2\sqrt{1+R_{11}-R_{22}-R_{33}}\\)

\\(q_w=\frac{1}{s}(R_{32}-R_{23})\\)

\\(q_x=\frac{s}{4}\\)

\\(q_y=\frac{1}{s}(R_{21}+R_{12})\\)

\\(q_z=\frac{1}{s}(R_{31}+R_{13})\\)

else if \\(R_{22}>R_{33}\\) then

\\(s=2\sqrt{1+R_{22}-R_{11}-R_{33}}\\)

\\(q_w=\frac{1}{s}(R_{13}-R_{31})\\)

\\(q_x=\frac{1}{s}(R_{21}+R_{12})\\)

\\(q_y=\frac{s}{4}\\)

\\(q_z=\frac{1}{s}(R_{32}+R_{23})\\)

else

\\(s=2\sqrt{1+R_{33}-R_{11}-R_{22}}\\)

\\(q_w=\frac{1}{s}(R_{21}-R_{12})\\)

\\(q_x=\frac{1}{s}(R_{31}+R_{13})\\)

\\(q_y=\frac{1}{s}(R_{32}+R_{23})\\)

\\(q_z=\frac{s}{4}\\)

The formulas are structurally identical to B2W, but plugging in \\(\mathbf{R}\_W^B\\) entries (which are the transpose of \\(\mathbf{R}\_B^W\\)) naturally produces the conjugate quaternion.

> D = W2B, F = Active:

\\(\delta=\text{trace}(\boldsymbol{R})\\)

if \\(\delta>0\\) then

\\(s=2\sqrt{\delta+1}\\)

\\(q_w=\frac{s}{4}\\)

\\(q_x=\frac{1}{s}(R_{23}-R_{32})\\)

\\(q_y=\frac{1}{s}(R_{31}-R_{13})\\)

\\(q_z=\frac{1}{s}(R_{12}-R_{21})\\)

else if \\(R_{11}>R_{22}\\) and \\(R_{11}>R_{33}\\) then

\\(s=2\sqrt{1+R_{11}-R_{22}-R_{33}}\\)

\\(q_w=\frac{1}{s}(R_{23}-R_{32})\\)

\\(q_x=\frac{s}{4}\\)

\\(q_y=\frac{1}{s}(R_{21}+R_{12})\\)

\\(q_z=\frac{1}{s}(R_{31}+R_{13})\\)

else if \\(R_{22}>R_{33}\\) then

\\(s=2\sqrt{1+R_{22}-R_{11}-R_{33}}\\)

\\(q_w=\frac{1}{s}(R_{31}-R_{13})\\)

\\(q_x=\frac{1}{s}(R_{21}+R_{12})\\)

\\(q_y=\frac{s}{4}\\)

\\(q_z=\frac{1}{s}(R_{32}+R_{23})\\)

else

\\(s=2\sqrt{1+R_{33}-R_{11}-R_{22}}\\)

\\(q_w=\frac{1}{s}(R_{12}-R_{21})\\)

\\(q_x=\frac{1}{s}(R_{31}+R_{13})\\)

\\(q_y=\frac{1}{s}(R_{32}+R_{23})\\)

\\(q_z=\frac{s}{4}\\)

### Action

> F = passive

$$\mathbf{R}_A^B~^A\mathbf{v}=^B\mathbf{v}$$

> F = active

$$\mathbf{R}~^A\mathbf{v}=^A\mathbf{v}'$$

### Composition and Inversion

**Composition**

$$\mathbf{R}_B^C\mathbf{R}_A^B=\mathbf{R}_A^C$$

**Inversion**

$$\left(\mathbf{R}_A^B\right)^{-1}=\left(\mathbf{R}_A^B\right)^T=\mathbf{R}_B^A$$

### Addition and Subtraction

Perturbations are represented by \\(\boldsymbol{\theta}\in \mathbb{R}^3\\), where local perturbations are expressed in the body frame and global perturbations are expressed in the world frame.

**Addition**

> F = Passive, D = B2W, P = Local

$$\boldsymbol{R}\_{B+}^{W}=\boldsymbol{R}\_{B}^{W} \text{Exp}\left(\boldsymbol{\theta}\_{B+}^{B}\right)$$

> F = Passive, D = B2W, P = Global

$$\boldsymbol{R}\_{B}^{W+}=\text{Exp}\left(\boldsymbol{\theta}\_{W}^{W+}\right)\boldsymbol{R}\_{B}^{W}$$

> F = Passive, D = W2B, P = Local

$$\boldsymbol{R}\_{W}^{B+}=\text{Exp}\left(\boldsymbol{\theta}\_{B}^{B+}\right)\boldsymbol{R}\_{W}^{B}$$

**Subtraction**

> F = Passive, D = B2W, P = Local

$$\boldsymbol{\theta}\_{B+}^{B}=\text{Log}\left((\boldsymbol{R}\_{B}^{W})^T\boldsymbol{R}\_{B+}^{W}\right)$$

> F = Passive, D = B2W, P = Global

$$\boldsymbol{\theta}\_{W}^{W+}=\text{Log}\left(\boldsymbol{R}\_{B}^{W+}(\boldsymbol{R}\_{B}^{W})^T\right)$$

> F = Passive, D = W2B, P = Local

$$\boldsymbol{\theta}\_{B}^{B+}=\text{Log}\left(\boldsymbol{R}\_{W}^{B+}(\boldsymbol{R}\_{W}^{B})^T\right)$$

### Notions of Distance

**Angular/Geodesic**

Gives the effective rotation angle about the correct axis:

$$||Log(\mathbf{R}_A^T\mathbf{R}_B)||=||Log(\mathbf{R}_B^T\mathbf{R}_A)||$$

**Chordal**

A computational, straight-line shortcut utilizing the Frobenius norm:

$$||\mathbf{R}_A-\mathbf{R}_B||_F=||\mathbf{R}_B-\mathbf{R}_A||_F$$
### Derivatives and (Numeric) Integration

> D = B2W:

$$\dot{\mathbf{R}}\_B^W=\mathbf{R}\_B^W[\boldsymbol{\omega}^B]\_\times=[\boldsymbol{\omega}^W]\_\times\mathbf{R}\_B^W$$

where \\(\boldsymbol{\omega}^B\\) and \\(\boldsymbol{\omega}^W\\) are the angular velocity expressed in the body and world frames, respectively.

> D = W2B, F = Passive:

$$\dot{\mathbf{R}}\_W^B=-[\boldsymbol{\omega}^B]\_\times\mathbf{R}\_W^B=-\mathbf{R}\_W^B[\boldsymbol{\omega}^W]\_\times$$

**Numeric Integration (first-order):**

> D = B2W:

$$\mathbf{R}\_B^W(t+\Delta t)\approx\mathbf{R}\_B^W(t)\cdot Exp(\boldsymbol{\omega}^B\Delta t)$$

> D = W2B, F = Passive:

$$\mathbf{R}\_W^B(t+\Delta t)\approx Exp(-\boldsymbol{\omega}^B\Delta t)\cdot\mathbf{R}\_W^B(t)$$

### Representational Strengths and Shortcomings

**Strengths**

  * Excellent for calculations

**Shortcomings**

  * Not very human-readable
  * Clearly redundant with 9 numbers for a 3-DOF quantity

### Unit Tests to Determine Conventions

1. Verify \\(\mathbf{R}^T\mathbf{R}=\mathbf{I}\\) and \\(\det(\mathbf{R})=1\\).
2. Construct a rotation of \\(\theta=90°\\) about the z-axis.
3. Apply \\(\mathbf{R}\\) to \\(\mathbf{v}=[1,0,0]^T\\):
   * Result \\([0,1,0]^T\\): **F = Active** or **(F = Passive, D = B2W)**.
   * Result \\([0,-1,0]^T\\): **F = Passive, D = W2B**.
4. To distinguish Active from Passive B2W: compose two 90° rotations about z, then about x. Check whether frame subscripts cancel (Passive) or the operation moves the vector (Active).
5. Identity check: \\(\mathbf{R}(0)=\mathbf{I}\\) for any axis.

## Euler Angles

*Assuming 3-2-1 ordering.*
### Construction Techniques

**From visualizing rotations from World to Body axes**

First consideration: Order. Follow the exact order in a straightforward fashion.

Second, handedness must be considered:

> H = Successive

Each rotation is visualized to be with respect to the transformed axes of the previous rotation. 

> H = Fixed

Each rotation is visualized to be with respect to the world axes.

Handedness must be noted for all future operations with the numbers you just generated.
### Conversions (To...)

*This is the computational bedrock of the usefulness of Euler Angles.* In fact, the Function and Directionality conventions only matter for conversions, and are dictated by the destination forms.

**Rotation Matrix**

See Rotation Matrix construction techniques for building the component \\(\mathbf{R}_i\\) matrices here.

First consideration is directionality of the matrices *(must be consistent)*:

> D = B2W

$$\mathbf{R}_B^W=\mathbf{R}_3\mathbf{R}_2\mathbf{R}_1$$

> D = W2B, F = Passive

$$\mathbf{R}_W^B=\mathbf{R}_1\mathbf{R}_2\mathbf{R}_3$$

> D = W2B, F = Active

$$\mathbf{R}=\mathbf{R}_3\mathbf{R}_2\mathbf{R}_1$$

Then, take into account handedness:

> H = Successive

Keep the above, which was derived assuming successive axes.

> H = Fixed

Reverse the above, whatever it is:

$$\mathbf{R}_a\mathbf{R}_b\mathbf{R}_c \rightarrow \mathbf{R}_c\mathbf{R}_b\mathbf{R}_a$$

And the reversed rotations must be with respect to the chosen fixed frame. See below.

The aim is to prove that intrinsic and extrinsic rotation compositions are applied in reverse order from each other. To prove this, consider three frames 0,1,2, where 0 is the fixed "world" frame. Suppose that \\(\mathbf{R}_2^0\\) represents the rotation of the 2-frame relative to the 0-frame. To encode that rotation relative to the 1-frame requires a **similarity transform**, granted that the frames no longer appear to cancel out nicely:

$$\mathbf{R}_2^1=(\mathbf{R}_1^0)^{-1}\mathbf{R}_2^0\mathbf{R}_1^0$$

Placing this within the context of rotation composition to get from frame 2 to 0, the composition looks like

$$\mathbf{R}_2^0=\mathbf{R}_1^0\mathbf{R}_2^1=\mathbf{R}_1^0((\mathbf{R}_1^0)^{-1}\mathbf{R}_2^0\mathbf{R}_1^0)=\mathbf{R}_2^0\mathbf{R}_1^0$$

Note the reversed directionality between the **intrinsic** composition \\(\mathbf{R}_1^0\mathbf{R}_2^1\\) and the *equivalent* **extrinsic** composition \\(\mathbf{R}_2^0\mathbf{R}_1^0\\). Generic rotations were used here, demonstrating generalizability.

**Rodrigues**

Convert to a rotation matrix first (using the Euler Angles \\(\rightarrow\\) Rotation Matrix formulas above), then extract the Rodrigues vector using the \\(SO(3)\\) logarithmic map.

**Quaternion**

*Direct method for 3-2-1 ordering, H = Successive:*

Compose the elemental quaternions for each axis rotation:

$$\mathbf{q}=\mathbf{q}\_3(\psi)\otimes\mathbf{q}\_2(\theta)\otimes\mathbf{q}\_1(\phi)$$

where (assuming O = \\(q\_w\\) first):

$$\mathbf{q}\_1(\phi)=\begin{bmatrix}\cos(\phi/2)\\\ \sin(\phi/2)\\\ 0\\\ 0\end{bmatrix},\quad \mathbf{q}\_2(\theta)=\begin{bmatrix}\cos(\theta/2)\\\ 0\\\ \sin(\theta/2)\\\ 0\end{bmatrix},\quad \mathbf{q}\_3(\psi)=\begin{bmatrix}\cos(\psi/2)\\\ 0\\\ 0\\\ \sin(\psi/2)\end{bmatrix}$$

Composition order follows the same directionality/handedness rules as the Euler Angles \\(\rightarrow\\) Rotation Matrix conversion. Alternatively, convert to a rotation matrix first and then extract the quaternion.

### Composition and Inversion

*Not applicable for Euler angles.* Composition and inversion are typically performed by first converting the Euler angles to a rotation matrix.
### Derivatives and (Numeric) Integration

Unlike with composition and inversion, there are methods of numeric differentiation and integration with Euler angles that are mathematically valid over infinitesimally small delta angles.

*Assuming 3-2-1 ordering (\\(\psi\\) yaw, \\(\theta\\) pitch, \\(\phi\\) roll), H = Successive, D = B2W.*

**Euler angle rates from body-frame angular velocity:**

$$\boldsymbol{\omega}^B=\begin{bmatrix}p\\\ q\\\ r\end{bmatrix}=\begin{bmatrix}1 & 0 & -\sin\theta\\\ 0 & \cos\phi & \sin\phi\cos\theta\\\ 0 & -\sin\phi & \cos\phi\cos\theta\end{bmatrix}\begin{bmatrix}\dot{\phi}\\\ \dot{\theta}\\\ \dot{\psi}\end{bmatrix}$$

**Inverse (for integration):**

$$\begin{bmatrix}\dot{\phi}\\\ \dot{\theta}\\\ \dot{\psi}\end{bmatrix}=\begin{bmatrix}1 & \sin\phi\tan\theta & \cos\phi\tan\theta\\\ 0 & \cos\phi & -\sin\phi\\\ 0 & \sin\phi\sec\theta & \cos\phi\sec\theta\end{bmatrix}\begin{bmatrix}p\\\ q\\\ r\end{bmatrix}$$

Note the singularity at \\(\theta=\pm\pi/2\\) in the inverse mapping (gimbal lock).

**Numeric Integration (first-order):**

$$\boldsymbol{\Theta}(t+\Delta t)\approx\boldsymbol{\Theta}(t)+\dot{\boldsymbol{\Theta}}(t)\Delta t$$

### Representational Strengths and Shortcomings

**Strengths**

  * Can be very intuitive
  * Minimal representation

**Shortcomings**

  * There are many different orders and conventions that people don't always specify
  * Operations with Euler angles involve trigonometric functions, and are thus slower to compute and more difficult to analyze
  * *Singularities/Gimbal Lock*: For example, \\(\mathbf{R}=\mathbf{R}_z(\delta)\mathbf{R}_y(\pi/2)\mathbf{R}_x(\alpha+\delta)\\) for *any* choice of \\(\delta\\). Singularities will occur for any 3-parameter representation (J. Stuelpnagel. On the Parametrization of the Three-Dimensional Rotation Group. SIAM Review, 6(4):422-430, 1964.).

### Unit Tests to Determine Conventions

1. Set \\((\psi,\theta,\phi)=(90°,0,0)\\) (pure yaw) and convert to a rotation matrix.
2. **Ordering**: Check which axis the rotation occurred about (the first number in the ordering label corresponds to the outermost rotation axis).
3. **Handedness**: Set \\((\psi,\theta,\phi)=(90°,45°,0)\\). Convert to a matrix and compare against constructing the same rotations about the successive (body) axes vs. the fixed (world) axes. The one that matches determines H.
4. **F and D**: Apply the resulting rotation matrix to a known vector and use the rotation matrix unit tests above to determine function and directionality.

## Euler/Rodrigues

### Construction Techniques

*Remember*, \\(\mathbf{u}\\) is expressed in the World frame, just as you would intuitively think.

**From Axis-Angle Representation: \\(\theta\\), \\(\mathbf{u}\\)**

Normalize \\(\mathbf{u}\\) and multiply by \\(\theta\\).

### Conversions (To...)

Besides tangent-space operations, this is the computational bedrock of the usefulness of Euler/Rodrigues.* In fact, as with Euler Angles, the Function and Directionality conventions only matter for conversions, and are dictated by the destination forms.

**Rotation Matrix**

*i.e., the SO(3) exponential map*.

*i.e., Rodrigues' rotation formula.

> D = B2W

$$\mathbf{R}\_B^W=\cos\theta\mathbf{I}+\sin\theta[\mathbf{u}]\_\times+(1-\cos\theta)\mathbf{u} \mathbf{u}^T$$

$$=\mathbf{I}+[\mathbf{u}]\_\times\sin\theta+[\mathbf{u}]\_\times^2(1-\cos\theta)$$

$$=exp([\theta\mathbf{u}]\_\times)=Exp(\theta\mathbf{u})$$

$$\approx \boldsymbol{I}+\lfloor \boldsymbol{\theta} \rfloor\_{\times}$$

> D = W2B, F = Passive

$$\mathbf{R}\_W^B=\cos\theta\mathbf{I}-\sin\theta[\mathbf{u}]\_\times+(1-\cos\theta)\mathbf{u}\mathbf{u}^T$$

$$=\mathbf{I}-[\mathbf{u}]\_\times\sin\theta+[\mathbf{u}]\_\times^2(1-\cos\theta)$$

$$=exp(-[\theta\mathbf{u}]\_\times)=Exp(-\theta\mathbf{u})$$

$$\approx\boldsymbol{I}-\lfloor\boldsymbol{\theta}\rfloor\_{\times}$$

> D = W2B, F = Active

Same matrix form as D = B2W:

$$\mathbf{R}=\cos\theta\mathbf{I}+\sin\theta[\mathbf{u}]\_\times+(1-\cos\theta)\mathbf{u}\mathbf{u}^T=Exp(\theta\mathbf{u})$$

$$\approx\boldsymbol{I}+\lfloor\boldsymbol{\theta}\rfloor\_{\times}$$

**Euler Angles**

Convert to a rotation matrix first using the \\(SO(3)\\) exponential map (Rodrigues' rotation formula above), then extract Euler angles using the Rotation Matrix \\(\rightarrow\\) Euler Angles formulas.

**Quaternion**

*i.e., the Quaternion exponential map*.

Assuming O = \\(q_w\\) *first*.

> D = B2W

$$\mathbf{q}=\begin{bmatrix}\cos(\theta/2) \\\ \sin(\theta/2)\mathbf{u}\end{bmatrix}$$

> D = W2B, F = Passive

$$\mathbf{q}=\begin{bmatrix}\cos(\theta/2) \\\ -\sin(\theta/2)\mathbf{u}\end{bmatrix}$$

i.e., the conjugate of the B2W quaternion: \\(\mathbf{q}\_W^B=(\mathbf{q}\_B^W)^{-1}\\).

> D = W2B, F = Active

$$\mathbf{q}=\begin{bmatrix}\cos(\theta/2) \\\ -\sin(\theta/2)\mathbf{u}\end{bmatrix}$$

Same values as W2B Passive. The quaternion uses \\(C\_S\\) instead of \\(C\_H\\) to map to the rotation matrix, but the quaternion components are identical.

### Composition and Inversion

**Composition**

Rodrigues vector composition does not have a clean closed-form expression. The standard approach is to convert to rotation matrices or quaternions, compose, and convert back:

$$(\theta\_1\mathbf{u}\_1)\circ(\theta\_2\mathbf{u}\_2)=Log\left(Exp(\theta\_1\mathbf{u}\_1)\cdot Exp(\theta\_2\mathbf{u}\_2)\right)$$

For small angles, the Baker-Campbell-Hausdorff (BCH) formula provides an approximation:

$$Log(Exp(\mathbf{a})\cdot Exp(\mathbf{b}))\approx\mathbf{a}+\mathbf{b}+\frac{1}{2}[\mathbf{a}]\_\times\mathbf{b}+\frac{1}{12}\left([\mathbf{a}]\_\times^2\mathbf{b}+[\mathbf{b}]\_\times^2\mathbf{a}\right)+\ldots$$

**Inversion**

$$(\theta\mathbf{u})^{-1}=-\theta\mathbf{u}$$

### Derivatives and (Numeric) Integration

The relationship between the Rodrigues vector rate and angular velocity involves the left and right Jacobians of \\(SO(3)\\):

$$\dot{\boldsymbol{\theta}}=\mathbf{J}\_l^{-1}(\boldsymbol{\theta})\boldsymbol{\omega}^W=\mathbf{J}\_r^{-1}(\boldsymbol{\theta})\boldsymbol{\omega}^B$$

where:

$$\mathbf{J}\_l(\boldsymbol{\theta})=\frac{\sin\theta}{\theta}\mathbf{I}+\left(1-\frac{\sin\theta}{\theta}\right)\mathbf{u}\mathbf{u}^T+\frac{1-\cos\theta}{\theta}[\mathbf{u}]\_\times$$

$$\mathbf{J}\_r(\boldsymbol{\theta})=\mathbf{J}\_l(-\boldsymbol{\theta})=\frac{\sin\theta}{\theta}\mathbf{I}+\left(1-\frac{\sin\theta}{\theta}\right)\mathbf{u}\mathbf{u}^T-\frac{1-\cos\theta}{\theta}[\mathbf{u}]\_\times$$

The inverse left Jacobian:

$$\mathbf{J}\_l^{-1}(\boldsymbol{\theta})=\frac{\theta/2}{\tan(\theta/2)}\mathbf{I}+\left(1-\frac{\theta/2}{\tan(\theta/2)}\right)\mathbf{u}\mathbf{u}^T-\frac{\theta}{2}[\mathbf{u}]\_\times$$

**Numeric Integration:**

$$\boldsymbol{\theta}(t+\Delta t)=Log\left(Exp(\boldsymbol{\theta}(t))\cdot Exp(\boldsymbol{\omega}^B\Delta t)\right)$$

### Representational Strengths and Shortcomings

**Strengths**

  * Constitutes the Lie Group of \\(SO(3)\\).
  * Easily visualized and understood
  * Minimal representation

**Shortcomings**

  * Similar to Euler Angles, operations are with trig functions, and thus slower to compute and harder to analyze (though the inverse is trivial to compute)
  * Non-unique!

### Unit Tests to Determine Conventions

1. Construct \\(\boldsymbol{\theta}=(\pi/2)\hat{\mathbf{z}}\\) (90° about z-axis) and convert to a rotation matrix.
2. Apply the rotation matrix unit tests to determine F and D.
3. Verify \\(Exp(\mathbf{0})=\mathbf{I}\\).
4. Verify \\(Exp(\boldsymbol{\theta})\cdot Exp(-\boldsymbol{\theta})=\mathbf{I}\\).

## Quaternions

### Construction Techniques

Because quaternions are so non-intuitive, it is generally best to construct a quaternion at the outset either as the identity rotation or converted from a different representation.

### Conversions (To...)

**Rotation Matrix**

> D = B2W

Hamiltonian cosine matrix:

$$\mathbf{R}=\mathbf{C}\_H=(q\_w^2-1)\boldsymbol{I}+2q\_w\lfloor\boldsymbol{q}\_v\rfloor\_{\times}+2\boldsymbol{q}\_v\boldsymbol{q}\_v^{\top}=\begin{bmatrix}1-2q\_y^2-2q\_z^2 & 2q\_xq\_y-2q\_wq\_z & 2q\_xq\_z+2q\_wq\_y \\\ 2q\_xq\_y+2q\_wq\_z & 1-2q\_x^2-2q\_z^2 & 2q\_yq\_z-2q\_wq\_x \\\ 2q\_xq\_z-2q\_wq\_y & 2q\_yq\_z+2q\_wq\_x & 1-2q\_x^2-2q\_y^2\end{bmatrix}$$

> D = W2B, F = Passive

$$\mathbf{R}=\mathbf{C}\_H=(q\_w^2-1)\boldsymbol{I}+2q\_w\lfloor\boldsymbol{q}\_v\rfloor\_{\times}+2\boldsymbol{q}\_v\boldsymbol{q}\_v^{\top}=\begin{bmatrix}1-2q\_y^2-2q\_z^2 & 2q\_xq\_y-2q\_wq\_z & 2q\_xq\_z+2q\_wq\_y \\\ 2q\_xq\_y+2q\_wq\_z & 1-2q\_x^2-2q\_z^2 & 2q\_yq\_z-2q\_wq\_x \\\ 2q\_xq\_z-2q\_wq\_y & 2q\_yq\_z+2q\_wq\_x & 1-2q\_x^2-2q\_y^2\end{bmatrix}$$

Same \\(C\_H\\) formula as B2W. The W2B passive quaternion \\(\mathbf{q}\_W^B=(\mathbf{q}\_B^W)^{-1}\\) produces \\(\mathbf{R}\_W^B=(\mathbf{R}\_B^W)^T\\) when plugged in. Note that \\(C\_H(\mathbf{q}\_W^B)=C\_S(\mathbf{q}\_B^W)\\).

> D = W2B, F = Active

Shuster cosine matrix:

$$\mathbf{R}=\mathbf{C}\_S=(q\_w^2-1)\boldsymbol{I}-2q\_w\lfloor\boldsymbol{q}\_v\rfloor\_{\times}+2\boldsymbol{q}\_v\boldsymbol{q}\_v^{\top}=\begin{bmatrix}1-2q\_y^2-2q\_z^2 & 2q\_xq\_y+2q\_wq\_z & 2q\_xq\_z-2q\_wq\_y \\\ 2q\_xq\_y-2q\_wq\_z & 1-2q\_x^2-2q\_z^2 & 2q\_yq\_z+2q\_wq\_x \\\ 2q\_xq\_z+2q\_wq\_y & 2q\_yq\_z-2q\_wq\_x & 1-2q\_x^2-2q\_y^2\end{bmatrix}$$



$$\mathbf{R}(\mathbf{q})=\mathbf{R}(-\mathbf{q}).$$

The use of \\(C_H\\) means that \\(\text{Exp}(\tilde{q}) \approx I + [\tilde{q}]\_\times \\) for small \\(\tilde{q}\\). For \\(C_S\\), the approximation becomes \\(I - [\tilde{q}]_\times\\). A transposed matrix flips the sign again. The sign change for the active + passive world-to-body convention is important because the *values* in the actual quaternion correspond to the *inverse* of the underlying passive quaternion. Thus, all Jacobians \\(\partial \cdot / \partial \tilde{q}\\)  must have that negated sign to send the linearizing derivatives in the correct direction given the apparent error-state value.

**Euler Angles**

*Assuming 3-2-1 ordering, O = \\(q\_w\\) first, D = B2W:*

$$\phi=\text{atan2}\left(2(q\_wq\_x+q\_yq\_z),1-2(q\_x^2+q\_y^2)\right)$$

$$\theta=\arcsin\left(2(q\_wq\_y-q\_xq\_z)\right)$$

$$\psi=\text{atan2}\left(2(q\_wq\_z+q\_xq\_y),1-2(q\_y^2+q\_z^2)\right)$$

For other conventions, convert to the rotation matrix first using the appropriate cosine matrix formula, then extract Euler angles from the matrix.

**Rodrigues**

*i.e., the Quaternion logarithmic map.*

Assuming O = \\(q\_w\\) first:

if \\(\lVert\mathbf{q}\_v\rVert>\epsilon\\):

$$\theta\mathbf{u}=Log(\mathbf{q})=2\text{atan2}(\lVert\mathbf{q}\_v\rVert,q\_w)\frac{\mathbf{q}\_v}{\lVert\mathbf{q}\_v\rVert}$$

else:

$$\theta\mathbf{u}=Log(\mathbf{q})\approx 2\frac{\mathbf{q}\_v}{q\_w}$$

To avoid \\(\theta>\pi\\), negate \\(\mathbf{q}\\) if \\(q\_w<0\\) before applying the map.

### Action

*Assuming O = \\(q_w\\) last. Flip for \\(q_w\\) first.*

> F = passive

$$\mathbf{q}_A^B \otimes \begin{bmatrix}^A\mathbf{v} \\\ 0\end{bmatrix} \otimes \left(\mathbf{q}_A^B\right)^{-1}=^B\mathbf{v}$$

**Homogeneous Coordinates:**

$$\mathbf{q}_A^B \otimes \begin{bmatrix}^A\mathbf{v} \\\ 1\end{bmatrix} \otimes \left(\mathbf{q}_A^B\right)^{-1}=^B\mathbf{v}$$

> F = active

$$\left(\mathbf{q}\right)^{-1} \otimes \begin{bmatrix}^A\mathbf{v} \\\ 0\end{bmatrix} \otimes \mathbf{q}=\begin{bmatrix}^A\mathbf{v}' \\\ 0\end{bmatrix}$$

**Homogeneous Coordinates:**

$$\left(\mathbf{q}\right)^{-1} \otimes \begin{bmatrix}^A\mathbf{v} \\\ 1\end{bmatrix} \otimes \mathbf{q}=\begin{bmatrix}^A\mathbf{v}' \\\ 1\end{bmatrix}$$

### Composition and Inversion

**Composition**

$$\mathbf{q}_1 \otimes \mathbf{q}_2=[\mathbf{q}_1]_L\mathbf{q}_2=[\mathbf{q}_2]_R\mathbf{q}_1$$

> H = Right, O = qw-first

$$[\mathbf{q}]\_L=\begin{bmatrix}q\_w & -\mathbf{q}\_v^T \\\ \mathbf{q}\_v & q\_w\mathbf{I}+[\mathbf{q}\_v]\_\times\end{bmatrix}=\begin{bmatrix}q\_w & -q\_x & -q\_y & -q\_z \\\ q\_x & q\_w & -q\_z & q\_y \\\ q\_y & q\_z & q\_w & -q\_x \\\ q\_z & -q\_y & q\_x & q\_w\end{bmatrix}$$

$$[\mathbf{q}]\_R=\begin{bmatrix}q\_w & -\mathbf{q}\_v^T \\\ \mathbf{q}\_v & q\_w\mathbf{I}-[\mathbf{q}\_v]\_\times\end{bmatrix}=\begin{bmatrix}q\_w & -q\_x & -q\_y & -q\_z \\\ q\_x & q\_w & q\_z & -q\_y \\\ q\_y & -q\_z & q\_w & q\_x \\\ q\_z & q\_y & -q\_x & q\_w \end{bmatrix}$$

> H = Right, O = qw-last

$$[\mathbf{q}]\_L=\begin{bmatrix}q\_w\mathbf{I}+[\mathbf{q}\_v]\_\times & \mathbf{q}\_v\\\ -\mathbf{q}\_v^T & q\_w\end{bmatrix}=\begin{bmatrix}q\_w & -q\_z & q\_y & q\_x\\\ q\_z & q\_w & -q\_x & q\_y\\\ -q\_y & q\_x & q\_w & q\_z \\\ -q\_x & -q\_y & -q\_z & q\_w\end{bmatrix}$$

$$[\mathbf{q}]\_R=\begin{bmatrix}q\_w\mathbf{I}-[\mathbf{q}\_v]\_\times & \mathbf{q}\_v\\\ -\mathbf{q}\_v^T & q\_w\end{bmatrix}=\begin{bmatrix}q\_w & q\_z & -q\_y & q\_x\\\ -q\_z & q\_w & q\_x & q\_y\\\q\_y & -q\_x & q\_w & q\_z \\\ -q\_x & -q\_y & -q\_z & q\_w\end{bmatrix}$$

> H = Left, O = qw-first

$$[\mathbf{q}]\_L=\begin{bmatrix}q\_w & -\mathbf{q}\_v^T \\\ \mathbf{q}\_v & q\_w\mathbf{I}-[\mathbf{q}\_v]\_\times\end{bmatrix}=\begin{bmatrix}q\_w & -q\_x & -q\_y & -q\_z \\\ q\_x & q\_w & q\_z & -q\_y \\\ q\_y & -q\_z & q\_w & q\_x \\\ q\_z & q\_y & -q\_x & q\_w \end{bmatrix}$$

$$[\mathbf{q}]\_R=\begin{bmatrix}q\_w & -\mathbf{q}\_v^T \\\ \mathbf{q}\_v & q\_w\mathbf{I}+[\mathbf{q}\_v]\_\times\end{bmatrix}=\begin{bmatrix}q\_w & -q\_x & -q\_y & -q\_z \\\ q\_x & q\_w & -q\_z & q\_y \\\ q\_y & q\_z & q\_w & -q\_x \\\ q\_z & -q\_y & q\_x & q\_w\end{bmatrix}$$

> H = Left, O = qw-last

$$[\mathbf{q}]\_L=\begin{bmatrix}q\_w\mathbf{I}-[\mathbf{q}\_v]\_\times & \mathbf{q}\_v \\\ -\mathbf{q}\_v^T & q\_w\end{bmatrix}=\begin{bmatrix}q\_w & q\_z & -q\_y & q\_x \\\ -q\_z & q\_w & q\_x & q\_y\\\q\_y & -q\_x & q\_w & q\_z \\\ -q\_x & -q\_y & -q\_z & q\_w\end{bmatrix}$$

$$[\mathbf{q}]\_R=\begin{bmatrix}q\_w\mathbf{I}+[\mathbf{q}\_v]\_\times & \mathbf{q}\_v\\\ -\mathbf{q}\_v^T & q\_w\end{bmatrix}=\begin{bmatrix}q\_w & -q\_z & q\_y & q\_x \\\ q\_z & q\_w & -q\_x & q\_y\\\ -q\_y & q\_x & q\_w & q\_z \\\ -q\_x & -q\_y & -q\_z & q\_w\end{bmatrix}$$

When attaching frames to the quaternions, composition has the potential for nuance due to the fact that, in certain implementations, a quaternion can be specified to represent a certain type of SO(3) rotation that actually uses different conventions from the quaternion. This seems unwise, but it happens, *as with certain manifestations of the JPL convention*. For that reason, one cannot simply exclusively pair Passive B2W behavior with active behavior, as other combinations are also fair game.

> D = B2W

$$\mathbf{q}_A^C=\mathbf{q}_B^C\otimes \mathbf{q}_A^B$$

> D = W2B, F = Passive

$$\mathbf{q}_A^C=\mathbf{q}_B^C\otimes \mathbf{q}_A^B$$

> D = W2B, F = Active

$$\mathbf{q}_A^C=\mathbf{q}_A^B\otimes \mathbf{q}_B^C$$

**Inversion**

$$\mathbf{q}^{-1}=\begin{bmatrix}q_w\\\ \mathbf{q}_v\end{bmatrix}^{-1}=\begin{bmatrix}q_w\\\ -\mathbf{q}_v\end{bmatrix}$$

$$\left(\mathbf{q}_a \otimes \mathbf{q}_b \otimes \dots \otimes \mathbf{q}_N\right)^{-1}=\mathbf{q}_N^{-1}\otimes \dots \otimes \mathbf{q}_b^{-1} \otimes \mathbf{q}_a^{-1}$$

### Addition and Subtraction

Perturbations are represented by \\(\boldsymbol{\theta}\in\mathbb{R}^3\\), where local perturbations are expressed in the body frame and global perturbations are expressed in the world frame.

**Addition**

> D = B2W, P = Local

$$\mathbf{q}\_{B+}^{W}=\mathbf{q}\_{B}^{W}\otimes\text{Exp}(\boldsymbol{\theta}\_{B+}^{B})$$

> D = B2W, P = Global

$$\mathbf{q}\_{B}^{W+}=\text{Exp}(\boldsymbol{\theta}\_{W}^{W+})\otimes\mathbf{q}\_{B}^{W}$$

> D = W2B, F = Passive, P = Local

$$\mathbf{q}\_{W}^{B+}=\text{Exp}(\boldsymbol{\theta}\_{B}^{B+})\otimes\mathbf{q}\_{W}^{B}$$

**Subtraction**

> D = B2W, P = Local

$$\boldsymbol{\theta}\_{B+}^{B}=\text{Log}\left((\mathbf{q}\_{B}^{W})^{-1}\otimes\mathbf{q}\_{B+}^{W}\right)$$

> D = B2W, P = Global

$$\boldsymbol{\theta}\_{W}^{W+}=\text{Log}\left(\mathbf{q}\_{B}^{W+}\otimes(\mathbf{q}\_{B}^{W})^{-1}\right)$$

> D = W2B, F = Passive, P = Local

$$\boldsymbol{\theta}\_{B}^{B+}=\text{Log}\left(\mathbf{q}\_{W}^{B+}\otimes(\mathbf{q}\_{W}^{B})^{-1}\right)$$

### Notions of Distance

**Quaternion distance**

$$||\mathbf{q}_A-\mathbf{q}_B||=||\mathbf{q}_B-\mathbf{q}_A||$$

A modification to account for the negative sign ambiguity:

$$\min_{b\in\{-1;+1\}}||\mathbf{q}_A-b\mathbf{q}_B||$$
### Derivatives and (Numeric) Integration

*Assuming O = \\(q\_w\\) first, H = Right.*

> D = B2W:

$$\dot{\mathbf{q}}\_B^W=\frac{1}{2}\mathbf{q}\_B^W\otimes\begin{bmatrix}0\\\ \boldsymbol{\omega}^B\end{bmatrix}=\frac{1}{2}\begin{bmatrix}0\\\ \boldsymbol{\omega}^W\end{bmatrix}\otimes\mathbf{q}\_B^W$$

> D = W2B, F = Passive:

$$\dot{\mathbf{q}}\_W^B=-\frac{1}{2}\begin{bmatrix}0\\\ \boldsymbol{\omega}^B\end{bmatrix}\otimes\mathbf{q}\_W^B=-\frac{1}{2}\mathbf{q}\_W^B\otimes\begin{bmatrix}0\\\ \boldsymbol{\omega}^W\end{bmatrix}$$

**Numeric Integration (first-order):**

> D = B2W:

$$\mathbf{q}\_B^W(t+\Delta t)=\mathbf{q}\_B^W(t)\otimes Exp(\boldsymbol{\omega}^B\Delta t)$$

> D = W2B, F = Passive:

$$\mathbf{q}\_W^B(t+\Delta t)=Exp(-\boldsymbol{\omega}^B\Delta t)\otimes\mathbf{q}\_W^B(t)$$

Always renormalize after integration to maintain unit norm: \\(\mathbf{q}\leftarrow\mathbf{q}/\lVert\mathbf{q}\rVert\\).

### Representational Strengths and Shortcomings

**Strengths**

  * Minimal representation with *no singularities*!
  * Fast computation without resorting to trigonometry
  * Composition has 16 products instead of 27 for rotation matrices

**Shortcomings**

  * Not as intuitive as Euler Angles
  * *Sign ambiguity* poses challenges that must be circumvented in control and estimation problems

### Unit Tests to Determine Correctness

1. **Identity**: \\(\mathbf{q}=[1,0,0,0]^T\\) (or \\([0,0,0,1]^T\\) for O = \\(q\_w\\) last) should yield \\(\mathbf{R}=\mathbf{I}\\).
2. **Inverse**: \\(\mathbf{q}\otimes\mathbf{q}^{-1}=\mathbf{q}\_{id}\\).
3. **Ordering**: Check whether the scalar is stored first or last in the library's data structure.
4. **Handedness**: Compute \\(\mathbf{q}\_i\otimes\mathbf{q}\_j\\) where \\(\mathbf{q}\_i=[0,1,0,0]^T\\) and \\(\mathbf{q}\_j=[0,0,1,0]^T\\) (O = \\(q\_w\\) first). Result \\([0,0,0,1]^T\\) implies **H = Right**; result \\([0,0,0,-1]^T\\) implies **H = Left**.
5. **Function and Directionality**: Construct a quaternion for 90° about z. Convert to a rotation matrix and apply the rotation matrix convention tests.
6. **Double cover**: Verify \\(\mathbf{R}(\mathbf{q})=\mathbf{R}(-\mathbf{q})\\).
7. **Norm preservation**: \\(\lVert\mathbf{q}\_1\otimes\mathbf{q}\_2\rVert=\lVert\mathbf{q}\_1\rVert\cdot\lVert\mathbf{q}\_2\rVert\\).
