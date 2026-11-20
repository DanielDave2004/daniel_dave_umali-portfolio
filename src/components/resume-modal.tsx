"use client";
import { useState } from "react";
import { Download, ExternalLink, FileText } from "lucide-react";
import { resume } from "@/data/resume";
import { PortfolioModal } from "@/components/portfolio-modal";
export function ResumeModalButton({ className = "button button-outline" }: {className?: string}) {
 const [open,setOpen] = useState(false);
 return <><button type="button" className={className} onClick={()=>setOpen(true)}><FileText size={16}/> View Resume</button>
 <PortfolioModal open={open} onClose={()=>setOpen(false)} title={resume.title} className="portfolio-modal-resume">
  <div className="portfolio-modal-actions"><a href={resume.filePath} target="_blank" rel="noopener noreferrer"><ExternalLink size={16}/> Open full PDF</a>{resume.showDownload&&<a href={resume.filePath} download={resume.downloadName}><Download size={16}/> Download Resume</a>}</div>
  <iframe className="portfolio-pdf-frame" title="Resume PDF preview" src={`${resume.filePath}#toolbar=1&navpanes=0`} />
  <p className="portfolio-modal-hint">If your browser cannot preview PDFs, choose Open full PDF or Download Resume.</p>
 </PortfolioModal></>;
}
