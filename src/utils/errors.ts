/**
 * RFC 7807 Problem Details representation for Grandfleet API errors.
 */
export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  code?: string;
  [key: string]: unknown;
}

export class ProblemDetailsError extends Error {
  public readonly problem: ProblemDetails;

  constructor(problem: ProblemDetails) {
    super(`[${problem.status}] ${problem.title}${problem.detail ? `: ${problem.detail}` : ''}`);
    this.name = 'ProblemDetailsError';
    this.problem = problem;
    Object.setPrototypeOf(this, ProblemDetailsError.prototype);
  }

  public get status(): number {
    return this.problem.status;
  }

  public get code(): string | undefined {
    return this.problem.code;
  }
}
