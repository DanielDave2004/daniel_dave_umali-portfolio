"use client";
import { useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, ImageIcon, ZoomIn } from "lucide-react";
import { PortfolioModal } from "@/components/portfolio-modal";

export function ProjectImageGallery({ title, images, isExample = false }: {title: string; images: string[]; isExample?: boolean}) {
 const [selected,setSelected] = useState(0);
 const [open,setOpen] = useState(false);
 if(!images.length) return <div className="project-gallery-empty"><ImageIcon size={22}/> Add screenshots under public/projects and list paths in src/data/portfolio.ts.</div>;
 const image=images[selected];
 const move=(step:number)=>setSelected(i=>(i+step+images.length)%images.length);
 return <div className="project-gallery">
  <button type="button" className="project-gallery-feature" onClick={()=>setOpen(true)} aria-label={`View image ${selected+1} for ${title}`}><img src={image} alt={`${title}, screenshot ${selected+1}${isExample?' (generated example)':''}`} /><span className="project-gallery-zoom"><ZoomIn size={16}/> View image</span>{isExample&&<span className="project-gallery-example">GENERATED SAMPLE · REPLACE WITH YOUR WORK</span>}</button>
  {images.length>1&&<div className="project-gallery-thumbnails">{images.map((src,index)=><button type="button" key={`${src}-${index}`} onClick={()=>setSelected(index)} className={selected===index?'is-active':''} aria-label={`Select screenshot ${index+1}`}><img src={src} alt={`Thumbnail ${index+1}`}/></button>)}</div>}
  <PortfolioModal open={open} onClose={()=>setOpen(false)} title={`${title} · ${selected+1}/${images.length}`} className="portfolio-modal-project">
   <div className="project-gallery-large"><img src={image} alt={`${title} screenshot ${selected+1}`} />{images.length>1&&<div className="project-gallery-arrows"><button type="button" onClick={()=>move(-1)} aria-label="Previous screenshot"><ChevronLeft size={20}/></button><button type="button" onClick={()=>move(1)} aria-label="Next screenshot"><ChevronRight size={20}/></button></div>}</div>
   <div className="portfolio-modal-actions"><a href={image} target="_blank" rel="noopener noreferrer"><ArrowUpRight size={15}/> Open image</a><span>{isExample?'Generated sample image, not a real project screenshot.':''}</span></div>
  </PortfolioModal>
 </div>;
}
