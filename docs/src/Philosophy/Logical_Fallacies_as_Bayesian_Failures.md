# Logical Fallacies as Failures of Probabilistic Reasoning

*Every classical logical fallacy can be understood as a specific failure to construct a Bayesian network that faithfully represents reality.*

## Introduction

In the [Bayesian Inference](../Autonomy/Estimation/Applied_Statistics_for_Stochastic_Processes/Bayesian_Inference.md) article, we saw that a Bayes net is a directed acyclic graph (DAG) whose nodes are random variables and whose edges encode conditional dependencies. The entire graph specifies a joint probability distribution over all of its variables, and answering questions about the world reduces to *querying* this distribution given observations. When the graph is well-constructed---meaning its structure, variable domains, and conditional distributions accurately reflect reality---the inferences drawn from it are sound. When any of these three components are wrong, the inferences break down in predictable ways.

This article argues that the classical logical fallacies catalogued by philosophers since Aristotle are not merely rhetorical tricks or lapses in attention. Each one corresponds to a *specific, identifiable failure mode* in the construction or querying of a probabilistic model. A fallacious argument is, at its core, an inference drawn from a malformed Bayes net---one whose graph has the wrong shape, whose variables have the wrong domains, or whose conditional distributions are miscalibrated.

The failure modes fall into five natural categories:

1. **Structural failures** --- the graph topology is wrong (missing nodes, extra edges, or cycles).
2. **Directional failures** --- the direction of inference along an edge is reversed without proper application of Bayes' rule.
3. **Domain failures** --- the random variables represent the wrong quantities or have artificially restricted sample spaces.
4. **Parametric failures** --- the conditional probability distributions or priors are miscalibrated.
5. **Chain failures** --- errors compound along sequential inference chains.

## Quick Review: What a Bayes Net Encodes

Recall that a Bayes net over variables \\(X_1, \dots, X_n\\) encodes their joint distribution by exploiting conditional independence:

$$P(X_1, \dots, X_n) = \prod_{i=1}^{n} P(X_i \mid \text{Parents}(X_i)).$$

Consider the following simple net:

<div style="text-align:center; margin: 1.5em 0;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="200">
  <defs>
    <marker id="f0-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#444"/>
    </marker>
  </defs>
  <line x1="62" y1="53" x2="88" y2="101" stroke="#444" stroke-width="2" marker-end="url(#f0-arr)"/>
  <line x1="138" y1="53" x2="112" y2="101" stroke="#444" stroke-width="2" marker-end="url(#f0-arr)"/>
  <circle cx="50" cy="40" r="22" fill="#fff" stroke="#444" stroke-width="2.5"/>
  <text x="50" y="41" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">A</text>
  <circle cx="150" cy="40" r="22" fill="#fff" stroke="#444" stroke-width="2.5"/>
  <text x="150" y="41" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">B</text>
  <circle cx="100" cy="115" r="22" fill="#fff" stroke="#444" stroke-width="2.5"/>
  <text x="100" y="116" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">C</text>
</svg>
</div>

This net asserts that \\(A\\) and \\(B\\) are independent root nodes and that \\(C\\) depends on both, giving a joint of \\(P(A,B,C) = P(C|A,B)\,P(A)\,P(B)\\). Three things must be correct for inferences from this model to be sound:

  1. **Structure:** The edges must reflect genuine causal or generative relationships, and no relevant variables may be missing.
  2. **Domains:** Each variable's sample space must include all values it can actually take.
  3. **Distributions:** The prior \\(P(A)\\), \\(P(B)\\), and the conditional \\(P(C|A,B)\\) must be calibrated to reality.

A logical fallacy arises when a reasoner implicitly constructs a mental model that violates one or more of these requirements.

----

## I. Structural Fallacies: Building the Wrong Graph

These fallacies arise when the topology of the reasoner's implicit Bayes net does not match the causal structure of reality---edges are added where none exist, genuine causes are omitted, or the acyclicity constraint is violated.

### Begging the Question --- Cycles in the Graph

**The fallacy in classical form:** Using the conclusion of an argument as one of its premises. *"God exists because the Bible says so, and the Bible is true because it is the word of God."*

**Bayesian diagnosis:** The reasoner has constructed a graph with a *cycle*. Node \\(P\\) generates evidence for \\(Q\\), which generates evidence for \\(R\\), which in turn supports \\(P\\). But a Bayes net must be a DAG---directed *acyclic* graph. Cycles make the joint distribution undefined because the chain rule cannot terminate: you can never reach an unconditional prior from which to begin calculating.

<div style="text-align:center; margin: 1.5em 0;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 470 175" width="470">
  <defs>
    <marker id="f1-arrr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#c0392b"/>
    </marker>
    <marker id="f1-arrb" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#2471a3"/>
    </marker>
  </defs>
  <!-- Left: Cycle (invalid) -->
  <line x1="93" y1="53" x2="137" y2="112" stroke="#c0392b" stroke-width="2" marker-end="url(#f1-arrr)"/>
  <line x1="126" y1="130" x2="34" y2="130" stroke="#c0392b" stroke-width="2" marker-end="url(#f1-arrr)"/>
  <line x1="23" y1="112" x2="67" y2="53" stroke="#c0392b" stroke-width="2" marker-end="url(#f1-arrr)"/>
  <circle cx="80" cy="35" r="22" fill="#fff" stroke="#c0392b" stroke-width="2.5"/>
  <text x="80" y="36" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">P</text>
  <circle cx="150" cy="130" r="22" fill="#fff" stroke="#c0392b" stroke-width="2.5"/>
  <text x="150" y="131" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">Q</text>
  <circle cx="10" cy="130" r="22" fill="#fff" stroke="#c0392b" stroke-width="2.5"/>
  <text x="10" y="131" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">R</text>
  <text x="80" y="168" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#c0392b">Cycle (invalid)</text>
  <!-- Right: DAG (valid) -->
  <line x1="333" y1="53" x2="377" y2="112" stroke="#2471a3" stroke-width="2" marker-end="url(#f1-arrb)"/>
  <line x1="307" y1="53" x2="263" y2="112" stroke="#2471a3" stroke-width="2" marker-end="url(#f1-arrb)"/>
  <circle cx="320" cy="35" r="22" fill="#fff" stroke="#2471a3" stroke-width="2.5"/>
  <text x="320" y="36" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">P</text>
  <circle cx="390" cy="130" r="22" fill="#fff" stroke="#2471a3" stroke-width="2.5"/>
  <text x="390" y="131" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">Q</text>
  <circle cx="250" cy="130" r="22" fill="#fff" stroke="#2471a3" stroke-width="2.5"/>
  <text x="250" y="131" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">R</text>
  <text x="320" y="168" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#2471a3">DAG (valid)</text>
  <!-- Divider -->
  <line x1="200" y1="10" x2="200" y2="165" stroke="#ccc" stroke-width="1" stroke-dasharray="4,3"/>
</svg>
</div>

Formally, the chain rule for the cyclic graph would require

$$P(P) = \cdots = f(P(R)) = f(g(P(Q))) = f(g(h(P(P))))$$

which is a fixed-point equation, not a generative model. There is no unconditional distribution from which to begin inference. The argument provides no new information---it is self-referential.

**The fix:** Every sound argument must ultimately trace back to premises whose truth is established independently of the conclusion. In Bayes net terms, the graph must be acyclic, terminating at root nodes (priors) whose distributions are specified without reference to their descendants.

### Post Hoc Ergo Propter Hoc --- The Missing Confounder

**The fallacy in classical form:** Assuming that because event \\(A\\) preceded event \\(B\\), \\(A\\) must have caused \\(B\\). *"I wore my lucky socks and we won the game; therefore the socks caused the victory."*

**Bayesian diagnosis:** The reasoner's model has a direct edge \\(A \to B\\) where none should exist. The true causal structure involves a hidden common cause \\(C\\) (a *confounder*) that independently generates both \\(A\\) and \\(B\\). Marginalizing out \\(C\\) produces a statistical correlation between \\(A\\) and \\(B\\), which the reasoner mistakes for a direct causal link.

<div style="text-align:center; margin: 1.5em 0;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 195" width="440">
  <defs>
    <marker id="f2-arrr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#c0392b"/>
    </marker>
    <marker id="f2-arrb" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#2471a3"/>
    </marker>
  </defs>
  <!-- Left: Assumed direct cause -->
  <line x1="84" y1="95" x2="136" y2="95" stroke="#c0392b" stroke-width="2" marker-end="url(#f2-arrr)"/>
  <circle cx="60" cy="95" r="22" fill="#fff" stroke="#c0392b" stroke-width="2.5"/>
  <text x="60" y="96" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">A</text>
  <circle cx="160" cy="95" r="22" fill="#fff" stroke="#c0392b" stroke-width="2.5"/>
  <text x="160" y="96" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">B</text>
  <text x="110" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#c0392b">Assumed Model</text>
  <!-- Divider -->
  <line x1="220" y1="10" x2="220" y2="180" stroke="#ccc" stroke-width="1" stroke-dasharray="4,3"/>
  <!-- Right: True causal structure with confounder -->
  <line x1="321" y1="56" x2="283" y2="124" stroke="#2471a3" stroke-width="2" marker-end="url(#f2-arrb)"/>
  <line x1="339" y1="56" x2="377" y2="124" stroke="#2471a3" stroke-width="2" marker-end="url(#f2-arrb)"/>
  <circle cx="330" cy="38" r="22" fill="#fff" stroke="#2471a3" stroke-width="2.5"/>
  <text x="330" y="39" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">C</text>
  <circle cx="270" cy="142" r="22" fill="#fff" stroke="#2471a3" stroke-width="2.5"/>
  <text x="270" y="143" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">A</text>
  <circle cx="390" cy="142" r="22" fill="#fff" stroke="#2471a3" stroke-width="2.5"/>
  <text x="390" y="143" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">B</text>
  <line x1="294" y1="142" x2="366" y2="142" stroke="#999" stroke-width="1.5" stroke-dasharray="5,4"/>
  <text x="330" y="158" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#999">observed correlation</text>
  <text x="330" y="17" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#2471a3">True Model</text>
</svg>
</div>

In the assumed model, the reasoner computes \\(P(B|A)\\) using a direct conditional \\(P(B|A)\\). In the true model, \\(A\\) and \\(B\\) are *conditionally independent* given the confounder \\(C\\):

$$P(A,B|C) = P(A|C)\,P(B|C).$$

Their marginal correlation \\(P(A,B) = \sum_C P(A|C)\,P(B|C)\,P(C) \neq P(A)\,P(B)\\) is real but not causal. The correlation vanishes once \\(C\\) is observed. This is why controlled experiments---which hold \\(C\\) fixed---are essential for establishing causation.

### Survivorship Bias --- Conditioning on a Collider

**The fallacy in classical form:** Drawing conclusions from a non-representative sample that has been filtered by some selection process. *"Exposed buildings in this city are all well-built, so construction quality must be high."* (Ignoring that poorly-built buildings collapsed and were removed from the sample.)

**Bayesian diagnosis:** Two independent causes \\(A\\) and \\(B\\) both influence a common effect \\(S\\) (a *collider*). When we condition on \\(S\\)---by observing only cases where \\(S\\) takes a particular value---we inadvertently create a spurious statistical dependency between \\(A\\) and \\(B\\), even though they are marginally independent.

<div style="text-align:center; margin: 1.5em 0;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 190" width="300">
  <defs>
    <marker id="f3-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#444"/>
    </marker>
  </defs>
  <line x1="66" y1="55" x2="134" y2="113" stroke="#444" stroke-width="2" marker-end="url(#f3-arr)"/>
  <line x1="234" y1="55" x2="166" y2="113" stroke="#444" stroke-width="2" marker-end="url(#f3-arr)"/>
  <line x1="74" y1="40" x2="226" y2="40" stroke="#c0392b" stroke-width="1.5" stroke-dasharray="5,4"/>
  <text x="150" y="28" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#c0392b">spurious dependency</text>
  <circle cx="50" cy="40" r="22" fill="#fff" stroke="#444" stroke-width="2.5"/>
  <text x="50" y="41" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">A</text>
  <circle cx="250" cy="40" r="22" fill="#fff" stroke="#444" stroke-width="2.5"/>
  <text x="250" y="41" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">B</text>
  <circle cx="150" cy="130" r="22" fill="#e8e8e8" stroke="#444" stroke-width="2.5"/>
  <text x="150" y="131" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">S</text>
  <text x="150" y="165" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#666">(observed / selected)</text>
</svg>
</div>

This is known in statistics as *Berkson's paradox*. Formally, \\(A \perp B\\) marginally, but \\(A \not\perp B \mid S\\). The joint factors as:

$$P(A,B,S) = P(S|A,B)\,P(A)\,P(B)$$

and conditioning on \\(S\\) yields \\(P(A,B|S) = \eta\, P(S|A,B)\,P(A)\,P(B)\\), which generally does *not* factor into \\(P(A|S)\,P(B|S)\\). Knowing that \\(S\\) occurred and that \\(A\\) did not contribute makes \\(B\\) more likely as an explanation---hence the spurious correlation.

**Example:** Among admitted university students (\\(S\\) = admitted), academic talent (\\(A\\)) and athletic talent (\\(B\\)) may appear negatively correlated---not because they are, but because admissions selected for at least one.

----

## II. Directional Fallacies: Reversing the Arrows

These fallacies arise from confusing the direction of conditional probability---treating \\(P(B|A)\\) as though it were \\(P(A|B)\\)---without the corrective machinery of Bayes' rule.

### Affirming the Consequent --- Inverting a Conditional

**The fallacy in classical form:** *"If it rains, the ground is wet. The ground is wet. Therefore, it rained."* The argument treats \\(P(\text{Rain}|\text{Wet})\\) as equivalent to \\(P(\text{Wet}|\text{Rain})\\).

**Bayesian diagnosis:** The reasoner's model has an edge \\(A \to B\\) with a well-defined forward conditional \\(P(B|A)\\). They observe \\(B\\) and want to infer \\(A\\), but they skip Bayes' rule and treat the forward conditional as the backward one:

<div style="text-align:center; margin: 1.5em 0;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 155" width="300">
  <defs>
    <marker id="f4-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#2471a3"/>
    </marker>
    <marker id="f4-arrr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#c0392b"/>
    </marker>
  </defs>
  <!-- Forward edge -->
  <line x1="99" y1="55" x2="201" y2="55" stroke="#2471a3" stroke-width="2.5" marker-end="url(#f4-arr)"/>
  <text x="150" y="43" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="#2471a3">P(B | A)</text>
  <!-- Reverse (fallacious) curve -->
  <path d="M201,70 C201,125 99,125 99,70" stroke="#c0392b" stroke-width="2" fill="none" stroke-dasharray="6,3" marker-end="url(#f4-arrr)"/>
  <text x="150" y="115" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="13" fill="#c0392b">P(A | B) &#x2260; P(B | A)</text>
  <!-- Nodes -->
  <circle cx="75" cy="55" r="22" fill="#fff" stroke="#444" stroke-width="2.5"/>
  <text x="75" y="56" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">A</text>
  <circle cx="225" cy="55" r="22" fill="#e8e8e8" stroke="#444" stroke-width="2.5"/>
  <text x="225" y="56" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">B</text>
  <text x="225" y="142" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#666">(B observed)</text>
</svg>
</div>

Bayes' rule provides the correct inversion:

$$P(A|B) = \frac{P(B|A)\,P(A)}{P(B)} = \frac{P(B|A)\,P(A)}{\sum_{a} P(B|A=a)\,P(A=a)}.$$

The key insight is that \\(P(A|B)\\) depends critically on the *prior* \\(P(A)\\) and on all other possible causes of \\(B\\) (captured in the denominator). The fallacy of affirming the consequent amounts to setting \\(P(A) = 1\\) and ignoring alternative explanations, which is equivalent to asserting that \\(A\\) is the *only* possible cause of \\(B\\).

### Denying the Antecedent --- Neglecting Alternative Parents

**The fallacy in classical form:** *"If it rains, the ground is wet. It didn't rain. Therefore, the ground is not wet."* This ignores that a sprinkler, a burst pipe, or a spill could also wet the ground.

**Bayesian diagnosis:** The reasoner's model has only a single parent \\(A\\) for child node \\(C\\), when in reality \\(C\\) has multiple parents \\(A, B, \dots\\) In the true model:

$$P(C | A, B) \neq P(C | A).$$

Even when \\(A\\) is observed to be false (\\(A = 0\\)), the child \\(C\\) can still be true if another parent \\(B\\) is active:

$$P(C=1 | A=0) = \sum_b P(C=1|A=0, B=b)\,P(B=b).$$

This is generally nonzero. The fallacy is a structural error: the reasoner's graph is *missing parent nodes*. By leaving out \\(B\\), the model artificially couples \\(C\\)'s fate entirely to \\(A\\), making \\(\neg A \Rightarrow \neg C\\) seem valid when it is not.

----

## III. Domain Fallacies: Misspecifying the Variables

These fallacies arise not from wrong edges or wrong distributions, but from defining the random variables themselves incorrectly---truncating their domains, substituting one variable for another, or conflating two distinct quantities under one name.

### The False Dilemma --- Truncating the Sample Space

**The fallacy in classical form:** Presenting only two options when more exist. *"You're either with us or against us."*

**Bayesian diagnosis:** A random variable \\(X\\) in the reasoner's model has been assigned the domain \\(\\{a, b\\}\\) when its true domain is \\(\\{a, b, c, d, \dots\\}\\). Since probabilities must sum to one over the domain, the artificial restriction forces

$$P(X = a) + P(X = b) = 1$$

which inflates the probabilities of \\(a\\) and \\(b\\) at the expense of the missing alternatives.

<div style="text-align:center; margin: 1.5em 0;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 140" width="380">
  <!-- Left: truncated domain -->
  <circle cx="80" cy="55" r="28" fill="#fff" stroke="#c0392b" stroke-width="2.5"/>
  <text x="80" y="52" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="20" fill="#333">X</text>
  <text x="80" y="100" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#c0392b">{A, B}</text>
  <text x="80" y="130" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#c0392b">Truncated Domain</text>
  <!-- Divider -->
  <line x1="190" y1="10" x2="190" y2="130" stroke="#ccc" stroke-width="1" stroke-dasharray="4,3"/>
  <!-- Right: full domain -->
  <circle cx="300" cy="55" r="28" fill="#fff" stroke="#2471a3" stroke-width="2.5"/>
  <text x="300" y="52" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="20" fill="#333">X</text>
  <text x="300" y="100" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#2471a3">{A, B, C, D, ...}</text>
  <text x="300" y="130" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#2471a3">Full Domain</text>
</svg>
</div>

In practice, the false dilemma distorts every conditional in which \\(X\\) participates. If a downstream node \\(Y\\) depends on \\(X\\), then \\(P(Y) = \sum_x P(Y|X=x)\,P(X=x)\\) is computed over the wrong support, yielding incorrect marginals for \\(Y\\) as well. The error propagates through the entire graph.

### The Straw Man --- Substituting the Query Variable

**The fallacy in classical form:** Refuting a distorted version of an opponent's argument rather than the actual argument. *"My opponent wants to improve public transit"* becomes *"My opponent wants to ban cars."*

**Bayesian diagnosis:** The reasoner wishes to evaluate \\(P(Q)\\) for some query variable \\(Q\\), but instead evaluates \\(P(\tilde{Q})\\) for a *different* variable \\(\tilde{Q}\\) that is easier to attack. Even if \\(\tilde{Q}\\) is correlated with \\(Q\\), they are not the same random variable:

$$P(\tilde{Q}=\text{false}) \not\Rightarrow P(Q=\text{false}).$$

This is akin to answering the wrong query on a Bayes net. The computational machinery may be perfectly correct, but it is applied to the wrong node. The resulting inference is valid for \\(\tilde{Q}\\) and irrelevant for \\(Q\\).

### Equivocation --- Conflating Distinct Variables

**The fallacy in classical form:** Using the same word to refer to different concepts within a single argument. *"A feather is light. What is light cannot be dark. Therefore, a feather cannot be dark."*

**Bayesian diagnosis:** The reasoner has created a single node in their Bayes net where two nodes should exist. If "light" in the sense of weight is variable \\(L_w\\) and "light" in the sense of brightness is variable \\(L_b\\), then the correct model has:

$$P(L_w) \perp P(L_b)$$

(assuming they are independent). The equivocator collapses these into one node \\(L\\), illicitly transferring the evidence or conditional distribution associated with \\(L_w\\) to \\(L_b\\). The resulting graph has fewer nodes than reality, and the joint distribution it encodes is wrong.

----

## IV. Parametric Fallacies: Miscalibrating the Distributions

Even when the graph topology and variable domains are correct, inference fails if the prior distributions or the conditional probability tables are wrong. These fallacies correspond to specific miscalibrations.

### Base Rate Neglect --- Dropping the Prior

**The fallacy in classical form:** Ignoring the prevalence of a condition when interpreting the significance of a positive test. *"The test is 99% accurate and I tested positive, so I almost certainly have the disease."*

**Bayesian diagnosis:** This is the most famous Bayesian fallacy. The reasoner correctly understands the likelihood \\(P(\text{Test}^+|\text{Disease})\\) but ignores the prior \\(P(\text{Disease})\\).

<div style="text-align:center; margin: 1.5em 0;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 210" width="340">
  <defs>
    <marker id="f6-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#444"/>
    </marker>
  </defs>
  <!-- Edge -->
  <line x1="170" y1="62" x2="170" y2="118" stroke="#444" stroke-width="2" marker-end="url(#f6-arr)"/>
  <!-- Disease node -->
  <circle cx="170" cy="40" r="22" fill="#fff" stroke="#444" stroke-width="2.5"/>
  <text x="170" y="41" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">D</text>
  <!-- Test node -->
  <circle cx="170" cy="140" r="22" fill="#e8e8e8" stroke="#444" stroke-width="2.5"/>
  <text x="170" y="141" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">T</text>
  <!-- Annotations -->
  <text x="65" y="44" text-anchor="end" font-family="Georgia, serif" font-size="13" fill="#c0392b">P(D) = 0.001</text>
  <text x="56" y="60" text-anchor="end" font-family="Arial, sans-serif" font-size="10" fill="#c0392b">(often ignored!)</text>
  <text x="255" y="95" text-anchor="start" font-family="Georgia, serif" font-size="13" fill="#2471a3">P(T&#x207A;|D) = 0.99</text>
  <text x="255" y="111" text-anchor="start" font-family="Georgia, serif" font-size="13" fill="#2471a3">P(T&#x207A;|&#xac;D) = 0.05</text>
  <!-- Query -->
  <text x="170" y="185" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#333">P(D | T&#x207A;) = ?</text>
  <text x="170" y="204" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#666">(observed: T&#x207A;)</text>
</svg>
</div>

Bayes' rule gives:

$$P(D|T^+) = \frac{P(T^+|D)\,P(D)}{P(T^+|D)\,P(D) + P(T^+|\neg D)\,P(\neg D)} = \frac{0.99 \times 0.001}{0.99 \times 0.001 + 0.05 \times 0.999} \approx 0.019.$$

Despite the 99% sensitivity, the posterior probability of disease given a positive test is only about 2%---because the disease is rare (\\(P(D) = 0.001\\)). The base-rate-neglecting reasoner, effectively substituting \\(P(D|T^+) \approx P(T^+|D) = 0.99\\), is off by a factor of fifty. This is precisely the error of ignoring the prior in the Bayesian update.

### The Gambler's Fallacy --- Fabricating Dependencies

**The fallacy in classical form:** Believing that past outcomes of independent events influence future outcomes. *"The coin has landed heads five times in a row, so tails is due."*

**Bayesian diagnosis:** The outcomes \\(X_1, X_2, \dots, X_n\\) of independent trials are, by definition, root nodes with no edges between them. The correct joint is simply

$$P(X_1, \dots, X_n) = \prod_i P(X_i).$$

The gambler's implicit model adds spurious edges, typically \\(X_{i} \to X_{i+1}\\), creating a Markov chain where none exists:

<div style="text-align:center; margin: 1.5em 0;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 165" width="420">
  <defs>
    <marker id="f7-arrr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#c0392b"/>
    </marker>
  </defs>
  <!-- Top row: Reality (independent) -->
  <text x="10" y="40" text-anchor="start" font-family="Arial, sans-serif" font-size="11" fill="#2471a3">Reality:</text>
  <circle cx="100" cy="35" r="20" fill="#fff" stroke="#2471a3" stroke-width="2.5"/>
  <text x="100" y="36" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="14" fill="#333">X&#x2081;</text>
  <circle cx="180" cy="35" r="20" fill="#fff" stroke="#2471a3" stroke-width="2.5"/>
  <text x="180" y="36" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="14" fill="#333">X&#x2082;</text>
  <circle cx="260" cy="35" r="20" fill="#fff" stroke="#2471a3" stroke-width="2.5"/>
  <text x="260" y="36" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="14" fill="#333">X&#x2083;</text>
  <circle cx="340" cy="35" r="20" fill="#fff" stroke="#2471a3" stroke-width="2.5"/>
  <text x="340" y="36" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="14" fill="#333">X&#x2084;</text>
  <!-- Bottom row: Fallacy (dependent chain) -->
  <text x="10" y="130" text-anchor="start" font-family="Arial, sans-serif" font-size="11" fill="#c0392b">Fallacy:</text>
  <line x1="122" y1="125" x2="158" y2="125" stroke="#c0392b" stroke-width="2" marker-end="url(#f7-arrr)"/>
  <line x1="202" y1="125" x2="238" y2="125" stroke="#c0392b" stroke-width="2" marker-end="url(#f7-arrr)"/>
  <line x1="282" y1="125" x2="318" y2="125" stroke="#c0392b" stroke-width="2" marker-end="url(#f7-arrr)"/>
  <circle cx="100" cy="125" r="20" fill="#fff" stroke="#c0392b" stroke-width="2.5"/>
  <text x="100" y="126" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="14" fill="#333">X&#x2081;</text>
  <circle cx="180" cy="125" r="20" fill="#fff" stroke="#c0392b" stroke-width="2.5"/>
  <text x="180" y="126" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="14" fill="#333">X&#x2082;</text>
  <circle cx="260" cy="125" r="20" fill="#fff" stroke="#c0392b" stroke-width="2.5"/>
  <text x="260" y="126" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="14" fill="#333">X&#x2083;</text>
  <circle cx="340" cy="125" r="20" fill="#fff" stroke="#c0392b" stroke-width="2.5"/>
  <text x="340" y="126" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="14" fill="#333">X&#x2084;</text>
</svg>
</div>

In the gambler's model, \\(P(X_{i+1}|X_i = \text{heads})\\) is biased toward tails (to "balance out"), so the joint becomes \\(\prod_i P(X_i|X_{i-1})\\) with a compensatory conditional. This model is simply wrong---it adds edges to the Bayes net that do not exist in reality.

It is worth noting that the *inverse* error also occurs: treating genuinely dependent events as independent (ignoring edges that do exist). This is the fallacy of **neglecting serial correlation**, common in financial modeling.

### The Conjunction Fallacy --- Inflating Joint Probabilities

**The fallacy in classical form:** Judging that the conjunction of two events is more likely than one of the events alone. The classic example due to Tversky and Kahneman: *"Linda is a bank teller AND a feminist activist"* is judged more likely than *"Linda is a bank teller."*

**Bayesian diagnosis:** For any two events \\(A\\) and \\(B\\), the axioms of probability require

$$P(A \cap B) \leq P(A).$$

This is not a property of any particular Bayes net---it is an axiom of the probability calculus itself. The conjunction fallacy occurs when the reasoner's internal probability assignments violate this axiom, typically because a vivid narrative (the conjunction) is more *representative* of the available evidence than the less specific single event.

In Bayes net terms, the reasoner has constructed a model where the joint distribution assigns \\(P(A=1, B=1) > P(A=1)\\), which is impossible. The "distribution" in their mental model is not a valid probability distribution at all---it fails to normalize correctly. This is a parametric error at the most fundamental level.

### Hasty Generalization --- Undersampled Evidence

**The fallacy in classical form:** Drawing a broad conclusion from too few observations. *"I met two rude people from that city, so everyone there must be rude."*

**Bayesian diagnosis:** Consider a static Bayes net (a naive Bayes classifier) where a hidden state \\(X\\) generates observations \\(Y_1, Y_2, \dots, Y_n\\). The posterior after \\(n\\) observations is

$$P(X|Y_1, \dots, Y_n) = \eta\, P(X) \prod_{i=1}^{n} P(Y_i|X).$$

When \\(n\\) is small, the posterior is dominated by the prior and the few observations. With only \\(n = 2\\) observations, the likelihood ratio \\(\prod P(Y_i|X=x)/P(Y_i|X=\bar{x})\\) may strongly favor one hypothesis, but the *confidence* in this conclusion should be low---the posterior is broad, not sharply peaked.

The hasty generalizer treats a weakly updated posterior as if it were a delta function: they observe \\(Y_1, Y_2\\) and act as though \\(X\\) has been determined with certainty. The Bayesian corrective is simple: keep the full posterior distribution and recognize that sparse evidence yields a wide, uncertain belief.

----

## V. Chain Fallacies: Compounding Errors Along Inference Paths

### The Slippery Slope --- Ignoring Accumulated Uncertainty

**The fallacy in classical form:** Arguing that a single step will inevitably lead, through a chain of consequences, to an extreme outcome. *"If we allow A, then B will follow, then C, then D, and eventually catastrophe E."*

**Bayesian diagnosis:** The reasoner's implicit model is a Markov chain \\(A \to B \to C \to D \to E\\), where each conditional \\(P(X_{k+1}|X_k)\\) has some probability \\(p_k < 1\\) of the "bad" transition occurring. The probability of the final catastrophe is the *product* of these conditionals:

$$P(E|A) = \sum_{B,C,D} P(E|D)\,P(D|C)\,P(C|B)\,P(B|A).$$

<div style="text-align:center; margin: 1.5em 0;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 165" width="520">
  <defs>
    <marker id="f8-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#444"/>
    </marker>
  </defs>
  <!-- Uncertainty ellipses (growing) -->
  <ellipse cx="60" cy="70" rx="28" ry="30" fill="none" stroke="#2471a3" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
  <ellipse cx="170" cy="70" rx="33" ry="35" fill="none" stroke="#2471a3" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
  <ellipse cx="280" cy="70" rx="40" ry="42" fill="none" stroke="#2471a3" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
  <ellipse cx="390" cy="70" rx="48" ry="50" fill="none" stroke="#2471a3" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.5"/>
  <ellipse cx="500" cy="70" rx="57" ry="58" fill="none" stroke="#2471a3" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.4"/>
  <!-- Edges -->
  <line x1="84" y1="70" x2="147" y2="70" stroke="#444" stroke-width="2" marker-end="url(#f8-arr)"/>
  <line x1="194" y1="70" x2="257" y2="70" stroke="#444" stroke-width="2" marker-end="url(#f8-arr)"/>
  <line x1="304" y1="70" x2="367" y2="70" stroke="#444" stroke-width="2" marker-end="url(#f8-arr)"/>
  <line x1="414" y1="70" x2="477" y2="70" stroke="#444" stroke-width="2" marker-end="url(#f8-arr)"/>
  <!-- Nodes -->
  <circle cx="60" cy="70" r="22" fill="#fff" stroke="#444" stroke-width="2.5"/>
  <text x="60" y="71" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">A</text>
  <circle cx="170" cy="70" r="22" fill="#fff" stroke="#444" stroke-width="2.5"/>
  <text x="170" y="71" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">B</text>
  <circle cx="280" cy="70" r="22" fill="#fff" stroke="#444" stroke-width="2.5"/>
  <text x="280" y="71" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">C</text>
  <circle cx="390" cy="70" r="22" fill="#fff" stroke="#444" stroke-width="2.5"/>
  <text x="390" y="71" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">D</text>
  <circle cx="500" cy="70" r="22" fill="#fff" stroke="#444" stroke-width="2.5"/>
  <text x="500" y="71" text-anchor="middle" dominant-baseline="central" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#333">E</text>
  <!-- Label -->
  <text x="280" y="152" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#2471a3">Uncertainty compounds at each step</text>
</svg>
</div>

Even if each individual transition is moderately probable---say \\(p_k = 0.7\\)---the chain probability drops rapidly:

$$P(E|A) \leq 0.7^4 = 0.24.$$

The slippery slope fallacy treats each \\(p_k\\) as though it were 1.0 (certainty), collapsing the probabilistic chain into a deterministic one. In the language of HMMs from the [Bayesian Inference](../Autonomy/Estimation/Applied_Statistics_for_Stochastic_Processes/Bayesian_Inference.md) article, this is equivalent to assuming zero process noise in every state transition---a modeling assumption that grows increasingly unrealistic with each additional link in the chain.

The dashed ellipses in the diagram represent the growing uncertainty envelope around the chain's trajectory. By the time we reach \\(E\\), the distribution is so broad that the "catastrophic" outcome is only one of many---and likely not the most probable.

----

## Conclusion: Thinking in Graphs

The unifying thesis of this article is simple: **all reasoning is inference, and all inference has a model**. When that model is implicit---as it always is in everyday human reasoning---its assumptions go unexamined, and errors creep in. The classical logical fallacies are not arbitrary categories of bad thinking. They are a remarkably systematic taxonomy of the ways a probabilistic model can be wrong:

| Failure Mode | What's Wrong | Example Fallacies |
|---|---|---|
| Wrong graph structure | Missing nodes, extra edges, or cycles | Circular reasoning, Post hoc, Survivorship bias |
| Wrong edge direction | Confusing \\(P(B\|A)\\) with \\(P(A\|B)\\) | Affirming the consequent, Denying the antecedent |
| Wrong variable domains | Truncated sample spaces, substituted variables | False dilemma, Straw man, Equivocation |
| Wrong distributions | Ignored priors, fabricated dependencies | Base rate neglect, Gambler's fallacy, Conjunction fallacy |
| Wrong chain inference | Treating uncertain chains as deterministic | Slippery slope |

The Bayesian framework does not merely *classify* these errors---it *quantifies* them. For each fallacy, there is a precise mathematical statement of what the reasoner assumed versus what is true, and Bayes' rule provides the corrective. Learning to recognize these failure modes is, in effect, learning to build better mental models of the world: models with the right variables, the right structure, and honestly calibrated uncertainty.

As the [Bayesian Inference](../Autonomy/Estimation/Applied_Statistics_for_Stochastic_Processes/Bayesian_Inference.md) article demonstrates in the engineering context, these same principles underpin the estimation algorithms that allow autonomous systems to navigate uncertain environments. The parallel is not a metaphor---human reasoning and robotic estimation are both instances of probabilistic inference over graphical models. The difference is that the robot's model is explicit and auditable. The aspiration of clear thinking is to make our own models equally so.
