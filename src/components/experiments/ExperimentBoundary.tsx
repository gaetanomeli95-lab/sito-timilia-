"use client";

import React from "react";

type Props = {
  name: string;
  children: React.ReactNode;
};

type State = {
  failed: boolean;
  message: string;
};

export default class ExperimentBoundary extends React.Component<Props, State> {
  state: State = { failed: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    return {
      failed: true,
      message: error instanceof Error ? error.message : "Errore runtime non identificato",
    };
  }

  componentDidCatch(error: unknown) {
    console.error(`[TIMILIA LAB] ${this.props.name} failed`, error);
  }

  render() {
    if (this.state.failed) {
      return (
        <section className="flex min-h-[45vh] items-center justify-center bg-[#080706] px-6 py-20 text-white">
          <div className="max-w-2xl rounded-2xl border border-red-400/25 bg-red-950/10 p-7">
            <p className="text-[10px] uppercase tracking-[0.28em] text-red-300/70">Visual Lab · diagnostica</p>
            <h2 className="mt-3 text-2xl font-light">{this.props.name} non disponibile</h2>
            <p className="mt-4 text-sm leading-7 text-white/55">Il resto del laboratorio continua a funzionare. Errore: {this.state.message}</p>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
