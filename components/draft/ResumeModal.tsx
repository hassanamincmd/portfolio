"use client";

import { useEffect, useId, useRef } from "react";

const RESUME_VERSION = "20260817";
const PDF_PATH = `/assets/Hassan-CV-resume.pdf?v=${RESUME_VERSION}`;
const PDF_NAME = "Hassan-CV-resume.pdf";

type ResumeModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ResumeModal({ open, onClose }: ResumeModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    lastFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.classList.add("resume-modal-open");
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("resume-modal-open");
      lastFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="resume-modal is-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="resume-modal__backdrop" onClick={onClose} />
      <div className="resume-modal__panel">
        <div className="resume-modal__header">
          <div>
            <span className="resume-modal__eyebrow">Resume / CV</span>
            <h2 className="resume-modal__title" id={titleId}>
              Hassan Amin
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="resume-modal__close"
            onClick={onClose}
            aria-label="Close resume preview"
          >
            <span />
            <span />
          </button>
        </div>
        <div className="resume-modal__actions">
          <a
            className="resume-modal__btn resume-modal__btn--primary"
            href={PDF_PATH}
            download={PDF_NAME}
          >
            Download PDF
          </a>
          <a
            className="resume-modal__btn resume-modal__btn--ghost"
            href={PDF_PATH}
            target="_blank"
            rel="noreferrer"
          >
            Open in New Tab
          </a>
        </div>
        <div className="resume-modal__viewer">
          <iframe
            className="resume-modal__iframe"
            title="Resume PDF preview"
            src={`${PDF_PATH}#toolbar=1&navpanes=0&view=FitH`}
          />
        </div>
      </div>
    </div>
  );
}
