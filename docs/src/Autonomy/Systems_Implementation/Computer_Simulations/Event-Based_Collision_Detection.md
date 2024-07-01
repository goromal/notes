# Event-Based Collision Detection

*Predict and handle a collision before it happens rather than make adjustments after the fact.*

## Planar Case

**Sources**
  * [1] [[https://algs4.cs.princeton.edu/61event/]]

[1] assumes all disks move in straight lines without any external forces or anything other than single-integrator dynamics. Then, you can form your global priority queue with impending collisions. This assumption can be circumvented by (assuming your simulation has a time step $\Delta t$) doing the same logic but limiting your sense of time to the **time window** $t=0\rightarrow \Delta t$ and resetting your priority queue at every time step. In fact, you can chop your normal simulation time step into a bunch of smaller $\Delta t$'s if the straight-line trajectory assumption holds up better over those smaller time steps.

^ Symbol ^ Meaning ^
| $p=\begin{bmatrix}p_x & p_y\end{bmatrix}^T$ | Agent position at start of time window. |
| $v=\begin{bmatrix}v_x & v_y\end{bmatrix}^T$ | Agent velocity at start of time window. |
| $r$ | Agent radius |
| $\pm h$ | y-limits where wall is located. |
| $\pm w$ | x-limits where wall is located. |

**For each time window:**

*Initialize discard list* $\mathcal{D}=\{(\text{time},\text{agent index})\}$ to empty.

*Form priority queue* $\mathcal{P}=\{[\tau](\text{time-of-insertion},\text{agent(s)},\text{collision TYPE})\}$, which sorts by time-to-collision $\tau$. Queue items can take the form of a special *collision* class.

For each agent $i$:
<WRAP indent>

If $v_y$ > 0:
<WRAP indent>

$\tau=(h-r-p_y)/v_y$

If $\tau \leq \Delta t$: Append [$\tau$](0,$i$, **WALL-UP**) to $\mathcal{P}$

</WRAP>
Else If $v_y$ < 0:
<WRAP indent>

$\tau=(-h+r-p_y)/v_y$

If $\tau \leq \Delta t$: Append [$\tau$](0,$i$, **WALL-DOWN**) to $\mathcal{P}$

</WRAP>
If $v_x$ > 0:
<WRAP indent>

$\tau=(w-r-p_x)/v_x$

If $\tau \leq \Delta t$: Append [$\tau$](0,$i$, **WALL-RIGHT**) to $\mathcal{P}$

</WRAP>
Else If $v_x$ < 0:
<WRAP indent>

$\tau=(-w+r-p_x)/v_x$

If $\tau \leq \Delta t$: Append [$\tau$](0,$i$, **WALL-LEFT**) to $\mathcal{P}$

</WRAP>

</WRAP>
For each pairwise combination (order doesn't matter) $(i,j)$ of agents:
<WRAP indent>

$\Delta p = p_j-p_i$

$\Delta v = v_j-v_i$

$\sigma = r_i + r_j$

$d=(\Delta v \cdot \Delta p)^2-(\Delta v \cdot \Delta v)(\Delta p \cdot \Delta p - \sigma^2)$

If $\Delta v \cdot \Delta p < 0$ and $d \geq 0$:
<WRAP indent>

$\tau = -\frac{\Delta v \cdot \Delta p + \sqrt{d}}{\Delta v \cdot \Delta v}$

If $\tau \leq \Delta t$: Append [$\tau$](0,$(i,j)$, **INTER-AGENT**) to $\mathcal{P}$

</WRAP>

</WRAP>

*Work through priority queue*:

While $\mathcal{P}$ not empty:
<WRAP indent>

Grab collision from top of queue.

If time-of-insertion < an item in $\mathcal{D}$ with a matching agent ID, then simply discard and delete (also the item in $\mathcal{D}$).

Else:
<WRAP indent>
Simulate all agents in the simulation and advance global time up to $t=\text{time-of-insertion}+\tau$.

Remove all items in $\mathcal{D}$ with time < $t$.

Carry out collision type and remove from $\mathcal{P}$.

Append to $\mathcal{D}$ tuples of $t$ and the agents involved.

For each agent involved, repeat all of the $\mathcal{P}$ append logic, replacing the insertion time with $t$.
</WRAP>

</WRAP>
