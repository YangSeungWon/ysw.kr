"use strict";(self.webpackChunkysw_kr=self.webpackChunkysw_kr||[]).push([[250],{2869:(e,t,n)=>{n.d(t,{Ay:()=>p});var i=n(6540);const o={x:0,y:0,width:0,height:0,unit:"px"},r=(e,t,n)=>Math.min(Math.max(e,t),n),h=(e,t)=>e===t||e.width===t.width&&e.height===t.height&&e.x===t.x&&e.y===t.y&&e.unit===t.unit;function a(e,t,n){return"%"===e.unit?{...o,...e,unit:"%"}:{unit:"%",x:e.x?e.x/t*100:0,y:e.y?e.y/n*100:0,width:e.width?e.width/t*100:0,height:e.height?e.height/n*100:0}}function s(e,t,n){return e.unit?"px"===e.unit?{...o,...e,unit:"px"}:{unit:"px",x:e.x?e.x*t/100:0,y:e.y?e.y*n/100:0,width:e.width?e.width*t/100:0,height:e.height?e.height*n/100:0}:{...o,...e,unit:"px"}}function d(e,t,n,i,o,r=0,h=0,a=i,s=o){const d={...e};let c=Math.min(r,i),l=Math.min(h,o),w=Math.min(a,i),p=Math.min(s,o);t&&(t>1?(c=h?h*t:c,l=c/t,w=a*t):(l=r?r/t:l,c=l*t,p=s/t)),d.y<0&&(d.height=Math.max(d.height+d.y,l),d.y=0),d.x<0&&(d.width=Math.max(d.width+d.x,c),d.x=0);const g=i-(d.x+d.width);g<0&&(d.x=Math.min(d.x,i-c),d.width+=g);const u=o-(d.y+d.height);if(u<0&&(d.y=Math.min(d.y,o-l),d.height+=u),d.width<c&&(("sw"===n||"nw"==n)&&(d.x-=c-d.width),d.width=c),d.height<l&&(("nw"===n||"ne"==n)&&(d.y-=l-d.height),d.height=l),d.width>w&&(("sw"===n||"nw"==n)&&(d.x-=w-d.width),d.width=w),d.height>p&&(("nw"===n||"ne"==n)&&(d.y-=p-d.height),d.height=p),t){const e=d.width/d.height;if(e<t){const e=Math.max(d.width/t,l);("nw"===n||"ne"==n)&&(d.y-=e-d.height),d.height=e}else if(e>t){const e=Math.max(d.height*t,c);("sw"===n||"nw"==n)&&(d.x-=e-d.width),d.width=e}}return d}const c={capture:!0,passive:!1};let l=0;const w=class e extends i.PureComponent{constructor(){super(...arguments),this.docMoveBound=!1,this.mouseDownOnCrop=!1,this.dragStarted=!1,this.evData={startClientX:0,startClientY:0,startCropX:0,startCropY:0,clientX:0,clientY:0,isResize:!0},this.componentRef=(0,i.createRef)(),this.mediaRef=(0,i.createRef)(),this.initChangeCalled=!1,this.instanceId="rc-"+l++,this.state={cropIsActive:!1,newCropIsBeingDrawn:!1},this.onCropPointerDown=e=>{const{crop:t,disabled:n}=this.props,i=this.getBox();if(!t)return;const o=s(t,i.width,i.height);if(n)return;e.cancelable&&e.preventDefault(),this.bindDocMove(),this.componentRef.current.focus({preventScroll:!0});const r=e.target.dataset.ord,h=!!r;let a=e.clientX,d=e.clientY,c=o.x,l=o.y;if(r){const t=e.clientX-i.x,n=e.clientY-i.y;let h=0,s=0;"ne"===r||"e"==r?(h=t-(o.x+o.width),s=n-o.y,c=o.x,l=o.y+o.height):"se"===r||"s"===r?(h=t-(o.x+o.width),s=n-(o.y+o.height),c=o.x,l=o.y):"sw"===r||"w"==r?(h=t-o.x,s=n-(o.y+o.height),c=o.x+o.width,l=o.y):("nw"===r||"n"==r)&&(h=t-o.x,s=n-o.y,c=o.x+o.width,l=o.y+o.height),a=c+i.x+h,d=l+i.y+s}this.evData={startClientX:a,startClientY:d,startCropX:c,startCropY:l,clientX:e.clientX,clientY:e.clientY,isResize:h,ord:r},this.mouseDownOnCrop=!0,this.setState({cropIsActive:!0})},this.onComponentPointerDown=e=>{const{crop:t,disabled:n,locked:i,keepSelection:o,onChange:r}=this.props,h=this.getBox();if(n||i||o&&t)return;e.cancelable&&e.preventDefault(),this.bindDocMove(),this.componentRef.current.focus({preventScroll:!0});const d=e.clientX-h.x,c=e.clientY-h.y,l={unit:"px",x:d,y:c,width:0,height:0};this.evData={startClientX:e.clientX,startClientY:e.clientY,startCropX:d,startCropY:c,clientX:e.clientX,clientY:e.clientY,isResize:!0},this.mouseDownOnCrop=!0,r(s(l,h.width,h.height),a(l,h.width,h.height)),this.setState({cropIsActive:!0,newCropIsBeingDrawn:!0})},this.onDocPointerMove=e=>{const{crop:t,disabled:n,onChange:i,onDragStart:o}=this.props,r=this.getBox();if(n||!t||!this.mouseDownOnCrop)return;e.cancelable&&e.preventDefault(),this.dragStarted||(this.dragStarted=!0,o&&o(e));const{evData:d}=this;let c;d.clientX=e.clientX,d.clientY=e.clientY,c=d.isResize?this.resizeCrop():this.dragCrop(),h(t,c)||i(s(c,r.width,r.height),a(c,r.width,r.height))},this.onComponentKeyDown=t=>{const{crop:n,disabled:i,onChange:o,onComplete:h}=this.props;if(i)return;const d=t.key;let c=!1;if(!n)return;const l=this.getBox(),w=this.makePixelCrop(l),p=(navigator.platform.match("Mac")?t.metaKey:t.ctrlKey)?e.nudgeStepLarge:t.shiftKey?e.nudgeStepMedium:e.nudgeStep;if("ArrowLeft"===d?(w.x-=p,c=!0):"ArrowRight"===d?(w.x+=p,c=!0):"ArrowUp"===d?(w.y-=p,c=!0):"ArrowDown"===d&&(w.y+=p,c=!0),c){t.cancelable&&t.preventDefault(),w.x=r(w.x,0,l.width-w.width),w.y=r(w.y,0,l.height-w.height);const e=s(w,l.width,l.height),n=a(w,l.width,l.height);o(e,n),h&&h(e,n)}},this.onHandlerKeyDown=(t,n)=>{const{aspect:i=0,crop:o,disabled:r,minWidth:c=0,minHeight:l=0,maxWidth:w,maxHeight:p,onChange:g,onComplete:u}=this.props,m=this.getBox();if(r||!o)return;if("ArrowUp"!==t.key&&"ArrowDown"!==t.key&&"ArrowLeft"!==t.key&&"ArrowRight"!==t.key)return;t.stopPropagation(),t.preventDefault();const y=(navigator.platform.match("Mac")?t.metaKey:t.ctrlKey)?e.nudgeStepLarge:t.shiftKey?e.nudgeStepMedium:e.nudgeStep,x=function(e,t,n,i){const o={...e};return"ArrowLeft"===t?"nw"===i?(o.x-=n,o.y-=n,o.width+=n,o.height+=n):"w"===i?(o.x-=n,o.width+=n):"sw"===i?(o.x-=n,o.width+=n,o.height+=n):"ne"===i?(o.y+=n,o.width-=n,o.height-=n):"e"===i?o.width-=n:"se"===i&&(o.width-=n,o.height-=n):"ArrowRight"===t&&("nw"===i?(o.x+=n,o.y+=n,o.width-=n,o.height-=n):"w"===i?(o.x+=n,o.width-=n):"sw"===i?(o.x+=n,o.width-=n,o.height-=n):"ne"===i?(o.y-=n,o.width+=n,o.height+=n):"e"===i?o.width+=n:"se"===i&&(o.width+=n,o.height+=n)),"ArrowUp"===t?"nw"===i?(o.x-=n,o.y-=n,o.width+=n,o.height+=n):"n"===i?(o.y-=n,o.height+=n):"ne"===i?(o.y-=n,o.width+=n,o.height+=n):"sw"===i?(o.x+=n,o.width-=n,o.height-=n):"s"===i?o.height-=n:"se"===i&&(o.width-=n,o.height-=n):"ArrowDown"===t&&("nw"===i?(o.x+=n,o.y+=n,o.width-=n,o.height-=n):"n"===i?(o.y+=n,o.height-=n):"ne"===i?(o.y+=n,o.width-=n,o.height-=n):"sw"===i?(o.x-=n,o.width+=n,o.height+=n):"s"===i?o.height+=n:"se"===i&&(o.width+=n,o.height+=n)),o}(s(o,m.width,m.height),t.key,y,n),C=d(x,i,n,m.width,m.height,c,l,w,p);if(!h(o,C)){const e=a(C,m.width,m.height);g(C,e),u&&u(C,e)}},this.onDocPointerDone=e=>{const{crop:t,disabled:n,onComplete:i,onDragEnd:o}=this.props,r=this.getBox();this.unbindDocMove(),!n&&t&&this.mouseDownOnCrop&&(this.mouseDownOnCrop=!1,this.dragStarted=!1,o&&o(e),i&&i(s(t,r.width,r.height),a(t,r.width,r.height)),this.setState({cropIsActive:!1,newCropIsBeingDrawn:!1}))},this.onDragFocus=()=>{var e;null==(e=this.componentRef.current)||e.scrollTo(0,0)}}get document(){return document}getBox(){const e=this.mediaRef.current;if(!e)return{x:0,y:0,width:0,height:0};const{x:t,y:n,width:i,height:o}=e.getBoundingClientRect();return{x:t,y:n,width:i,height:o}}componentDidUpdate(e){const{crop:t,onComplete:n}=this.props;if(n&&!e.crop&&t){const{width:e,height:i}=this.getBox();e&&i&&n(s(t,e,i),a(t,e,i))}}componentWillUnmount(){this.resizeObserver&&this.resizeObserver.disconnect(),this.unbindDocMove()}bindDocMove(){this.docMoveBound||(this.document.addEventListener("pointermove",this.onDocPointerMove,c),this.document.addEventListener("pointerup",this.onDocPointerDone,c),this.document.addEventListener("pointercancel",this.onDocPointerDone,c),this.docMoveBound=!0)}unbindDocMove(){this.docMoveBound&&(this.document.removeEventListener("pointermove",this.onDocPointerMove,c),this.document.removeEventListener("pointerup",this.onDocPointerDone,c),this.document.removeEventListener("pointercancel",this.onDocPointerDone,c),this.docMoveBound=!1)}getCropStyle(){const{crop:e}=this.props;if(e)return{top:`${e.y}${e.unit}`,left:`${e.x}${e.unit}`,width:`${e.width}${e.unit}`,height:`${e.height}${e.unit}`}}dragCrop(){const{evData:e}=this,t=this.getBox(),n=this.makePixelCrop(t),i=e.clientX-e.startClientX,o=e.clientY-e.startClientY;return n.x=r(e.startCropX+i,0,t.width-n.width),n.y=r(e.startCropY+o,0,t.height-n.height),n}getPointRegion(e,t,n,i){const{evData:o}=this,r=o.clientX-e.x,h=o.clientY-e.y;let a,s;return a=i&&t?"nw"===t||"n"===t||"ne"===t:h<o.startCropY,s=n&&t?"nw"===t||"w"===t||"sw"===t:r<o.startCropX,s?a?"nw":"sw":a?"ne":"se"}resolveMinDimensions(e,t,n=0,i=0){const o=Math.min(n,e.width),r=Math.min(i,e.height);return t&&(o||r)?t>1?o?[o,o/t]:[r*t,r]:r?[r*t,r]:[o,o/t]:[o,r]}resizeCrop(){const{evData:t}=this,{aspect:n=0,maxWidth:i,maxHeight:o}=this.props,h=this.getBox(),[a,s]=this.resolveMinDimensions(h,n,this.props.minWidth,this.props.minHeight);let c=this.makePixelCrop(h);const l=this.getPointRegion(h,t.ord,a,s),w=t.ord||l;let p=t.clientX-t.startClientX,g=t.clientY-t.startClientY;(a&&"nw"===w||"w"===w||"sw"===w)&&(p=Math.min(p,-a)),(s&&"nw"===w||"n"===w||"ne"===w)&&(g=Math.min(g,-s));const u={unit:"px",x:0,y:0,width:0,height:0};"ne"===l?(u.x=t.startCropX,u.width=p,n?(u.height=u.width/n,u.y=t.startCropY-u.height):(u.height=Math.abs(g),u.y=t.startCropY-u.height)):"se"===l?(u.x=t.startCropX,u.y=t.startCropY,u.width=p,u.height=n?u.width/n:g):"sw"===l?(u.x=t.startCropX+p,u.y=t.startCropY,u.width=Math.abs(p),u.height=n?u.width/n:g):"nw"===l&&(u.x=t.startCropX+p,u.width=Math.abs(p),n?(u.height=u.width/n,u.y=t.startCropY-u.height):(u.height=Math.abs(g),u.y=t.startCropY+g));const m=d(u,n,l,h.width,h.height,a,s,i,o);return n||e.xyOrds.indexOf(w)>-1?c=m:e.xOrds.indexOf(w)>-1?(c.x=m.x,c.width=m.width):e.yOrds.indexOf(w)>-1&&(c.y=m.y,c.height=m.height),c.x=r(c.x,0,h.width-c.width),c.y=r(c.y,0,h.height-c.height),c}renderCropSelection(){const{ariaLabels:t=e.defaultProps.ariaLabels,disabled:n,locked:o,renderSelectionAddon:r,ruleOfThirds:h,crop:a}=this.props,s=this.getCropStyle();if(a)return i.createElement("div",{style:s,className:"ReactCrop__crop-selection",onPointerDown:this.onCropPointerDown,"aria-label":t.cropArea,tabIndex:0,onKeyDown:this.onComponentKeyDown,role:"group"},!n&&!o&&i.createElement("div",{className:"ReactCrop__drag-elements",onFocus:this.onDragFocus},i.createElement("div",{className:"ReactCrop__drag-bar ord-n","data-ord":"n"}),i.createElement("div",{className:"ReactCrop__drag-bar ord-e","data-ord":"e"}),i.createElement("div",{className:"ReactCrop__drag-bar ord-s","data-ord":"s"}),i.createElement("div",{className:"ReactCrop__drag-bar ord-w","data-ord":"w"}),i.createElement("div",{className:"ReactCrop__drag-handle ord-nw","data-ord":"nw",tabIndex:0,"aria-label":t.nwDragHandle,onKeyDown:e=>this.onHandlerKeyDown(e,"nw"),role:"button"}),i.createElement("div",{className:"ReactCrop__drag-handle ord-n","data-ord":"n",tabIndex:0,"aria-label":t.nDragHandle,onKeyDown:e=>this.onHandlerKeyDown(e,"n"),role:"button"}),i.createElement("div",{className:"ReactCrop__drag-handle ord-ne","data-ord":"ne",tabIndex:0,"aria-label":t.neDragHandle,onKeyDown:e=>this.onHandlerKeyDown(e,"ne"),role:"button"}),i.createElement("div",{className:"ReactCrop__drag-handle ord-e","data-ord":"e",tabIndex:0,"aria-label":t.eDragHandle,onKeyDown:e=>this.onHandlerKeyDown(e,"e"),role:"button"}),i.createElement("div",{className:"ReactCrop__drag-handle ord-se","data-ord":"se",tabIndex:0,"aria-label":t.seDragHandle,onKeyDown:e=>this.onHandlerKeyDown(e,"se"),role:"button"}),i.createElement("div",{className:"ReactCrop__drag-handle ord-s","data-ord":"s",tabIndex:0,"aria-label":t.sDragHandle,onKeyDown:e=>this.onHandlerKeyDown(e,"s"),role:"button"}),i.createElement("div",{className:"ReactCrop__drag-handle ord-sw","data-ord":"sw",tabIndex:0,"aria-label":t.swDragHandle,onKeyDown:e=>this.onHandlerKeyDown(e,"sw"),role:"button"}),i.createElement("div",{className:"ReactCrop__drag-handle ord-w","data-ord":"w",tabIndex:0,"aria-label":t.wDragHandle,onKeyDown:e=>this.onHandlerKeyDown(e,"w"),role:"button"})),r&&i.createElement("div",{className:"ReactCrop__selection-addon",onPointerDown:e=>e.stopPropagation()},r(this.state)),h&&i.createElement(i.Fragment,null,i.createElement("div",{className:"ReactCrop__rule-of-thirds-hz"}),i.createElement("div",{className:"ReactCrop__rule-of-thirds-vt"})))}makePixelCrop(e){return s({...o,...this.props.crop||{}},e.width,e.height)}render(){const{aspect:e,children:t,circularCrop:n,className:o,crop:r,disabled:h,locked:a,style:s,ruleOfThirds:d}=this.props,{cropIsActive:c,newCropIsBeingDrawn:l}=this.state,w=r?this.renderCropSelection():null,p=((...e)=>e.filter((e=>e&&"string"==typeof e)).join(" "))("ReactCrop",o,c&&"ReactCrop--active",h&&"ReactCrop--disabled",a&&"ReactCrop--locked",l&&"ReactCrop--new-crop",r&&e&&"ReactCrop--fixed-aspect",r&&n&&"ReactCrop--circular-crop",r&&d&&"ReactCrop--rule-of-thirds",!this.dragStarted&&r&&!r.width&&!r.height&&"ReactCrop--invisible-crop",n&&"ReactCrop--no-animate");return i.createElement("div",{ref:this.componentRef,className:p,style:s},i.createElement("div",{ref:this.mediaRef,className:"ReactCrop__child-wrapper",onPointerDown:this.onComponentPointerDown},t),r?i.createElement("svg",{className:"ReactCrop__crop-mask",width:"100%",height:"100%"},i.createElement("defs",null,i.createElement("mask",{id:`hole-${this.instanceId}`},i.createElement("rect",{width:"100%",height:"100%",fill:"white"}),n?i.createElement("ellipse",{cx:`${r.x+r.width/2}${r.unit}`,cy:`${r.y+r.height/2}${r.unit}`,rx:`${r.width/2}${r.unit}`,ry:`${r.height/2}${r.unit}`,fill:"black"}):i.createElement("rect",{x:`${r.x}${r.unit}`,y:`${r.y}${r.unit}`,width:`${r.width}${r.unit}`,height:`${r.height}${r.unit}`,fill:"black"}))),i.createElement("rect",{fill:"black",fillOpacity:.5,width:"100%",height:"100%",mask:`url(#hole-${this.instanceId})`})):void 0,w)}};w.xOrds=["e","w"],w.yOrds=["n","s"],w.xyOrds=["nw","ne","se","sw"],w.nudgeStep=1,w.nudgeStepMedium=10,w.nudgeStepLarge=100,w.defaultProps={ariaLabels:{cropArea:"Use the arrow keys to move the crop selection area",nwDragHandle:"Use the arrow keys to move the north west drag handle to change the crop selection area",nDragHandle:"Use the up and down arrow keys to move the north drag handle to change the crop selection area",neDragHandle:"Use the arrow keys to move the north east drag handle to change the crop selection area",eDragHandle:"Use the up and down arrow keys to move the east drag handle to change the crop selection area",seDragHandle:"Use the arrow keys to move the south east drag handle to change the crop selection area",sDragHandle:"Use the up and down arrow keys to move the south drag handle to change the crop selection area",swDragHandle:"Use the arrow keys to move the south west drag handle to change the crop selection area",wDragHandle:"Use the up and down arrow keys to move the west drag handle to change the crop selection area"}};let p=w}}]);