import { BehaviorNode, BehaviorStatus, BrowserContext } from "../types/ai";

export abstract class CompositeNode implements BehaviorNode {
  protected children: BehaviorNode[] = [];

  constructor(children: BehaviorNode[] = []) {
    this.children = children;
  }

  public addChild(child: BehaviorNode): void {
    this.children.push(child);
  }

  public abstract tick(brain: any, context: BrowserContext): BehaviorStatus;
}

// Fallback / Selector Node (succeeds or runs if any child does)
export class Selector extends CompositeNode {
  public tick(brain: any, context: BrowserContext): BehaviorStatus {
    for (const child of this.children) {
      const status = child.tick(brain, context);
      if (status === "success" || status === "running") {
        return status;
      }
    }
    return "failure";
  }
}

// Sequence Node (succeeds only if all children succeed, fails if any fails)
export class Sequence extends CompositeNode {
  public tick(brain: any, context: BrowserContext): BehaviorStatus {
    for (const child of this.children) {
      const status = child.tick(brain, context);
      if (status === "failure" || status === "running") {
        return status;
      }
    }
    return "success";
  }
}

// Condition Node wraps a simple evaluation function
export class Condition implements BehaviorNode {
  private predicate: (brain: any, context: BrowserContext) => boolean;

  constructor(predicate: (brain: any, context: BrowserContext) => boolean) {
    this.predicate = predicate;
  }

  public tick(brain: any, context: BrowserContext): BehaviorStatus {
    return this.predicate(brain, context) ? "success" : "failure";
  }
}

// Action Node wraps an execution function
export class ActionNode implements BehaviorNode {
  private execute: (brain: any, context: BrowserContext) => BehaviorStatus;

  constructor(execute: (brain: any, context: BrowserContext) => BehaviorStatus) {
    this.execute = execute;
  }

  public tick(brain: any, context: BrowserContext): BehaviorStatus {
    return this.execute(brain, context);
  }
}
