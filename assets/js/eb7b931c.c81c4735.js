"use strict";(self.webpackChunkysw_kr=self.webpackChunkysw_kr||[]).push([[841],{2779:(e,r,t)=>{t.r(r),t.d(r,{default:()=>i});var n=t(6540),o=t(615),s=t(4848);function i(){const[e,r]=(0,n.useState)(""),[i,a]=(0,n.useState)(null),c=(0,n.useRef)(null),d=(0,n.useRef)(null),l=(0,n.useRef)(null);(0,n.useEffect)((()=>{if("undefined"!=typeof window){const e=t(3481);if(!c.current&&l.current){c.current=e.map(l.current).setView([37.5665,126.978],13),e.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}).addTo(c.current);const t=e.divIcon({className:"custom-marker",html:'<div style="\n                        width: 20px;\n                        height: 20px;\n                        border-radius: 50% 50% 50% 0;\n                        background: #3388ff;\n                        position: relative;\n                        transform: rotate(-45deg);\n                        border: 2px solid white;\n                        box-shadow: 0 0 6px rgba(0,0,0,0.4);\n                    "></div>',iconSize:[20,20],iconAnchor:[10,20]});c.current.on("click",(n=>{const{lat:o,lng:s}=n.latlng;d.current?d.current.setLatLng([o,s]):d.current=e.marker([o,s],{icon:t}).addTo(c.current),r(`${o}, ${s}`),u(o,s)}))}}return()=>{c.current&&(c.current.remove(),c.current=null)}}),[]);const u=(e,r)=>{if(isNaN(e)||isNaN(r))return void a({error:"Invalid coordinate format"});const t={DecimalDegrees:{CoordinateFormatString:"DDD.DDDDD\xb0",CoordinateString:`${p(e,!0)}, ${p(r,!1)}`},DegreesMinutesSeconds:{CoordinateFormatString:"DDD\xb0 MM' SS.S\"",CoordinateString:`${h(e,!0)}, ${h(r,!1)}`},DegreesMinutes:{CoordinateFormatString:"DDD\xb0 MM.MMM'",CoordinateString:`${g(e,!0)}, ${g(r,!1)}`}};a(t)},h=(e,r)=>{const t=Math.floor(Math.abs(e)),n=60*(Math.abs(e)-t),o=Math.floor(n);return`${e>=0?r?"N":"E":r?"S":"W"} ${t}\xb0 ${o}' ${(60*(n-o)).toFixed(1)}\u2033`},g=(e,r)=>{const t=Math.floor(Math.abs(e));return`${e>=0?r?"N":"E":r?"S":"W"} ${t}\xb0 ${(60*(Math.abs(e)-t)).toFixed(3)}\u2032`},p=(e,r)=>`${e>=0?r?"N":"E":r?"S":"W"} ${Math.abs(e).toFixed(5)}\xb0`;return(0,s.jsx)(o.A,{title:"Coordinate Conversion Tool",children:(0,s.jsxs)("div",{className:"container",children:[(0,s.jsx)("h1",{children:"Coordinate Conversion Tool"}),(0,s.jsxs)("div",{style:{marginBottom:"20px"},children:[(0,s.jsx)("input",{type:"text",value:e,onChange:e=>r(e.target.value),placeholder:"Enter coordinates (e.g., 36.009400, 129.323933)",className:"form-input",style:{marginRight:"10px"}}),(0,s.jsx)("button",{onClick:()=>{const[r,n]=e.split(",").map((e=>parseFloat(e.trim())));if(u(r,n),c.current){const e=t(3481),o=e.divIcon({className:"custom-marker",html:'<div style="\n                    width: 20px;\n                    height: 20px;\n                    border-radius: 50% 50% 50% 0;\n                    background: #3388ff;\n                    position: relative;\n                    transform: rotate(-45deg);\n                    border: 2px solid white;\n                    box-shadow: 0 0 6px rgba(0,0,0,0.4);\n                "></div>',iconSize:[20,20],iconAnchor:[10,20]});d.current?d.current.setLatLng([r,n]):d.current=e.marker([r,n],{icon:o}).addTo(c.current),c.current.setView([r,n],13)}},className:"button button--primary",children:"Convert"})]}),(0,s.jsxs)("div",{style:{marginBottom:"20px"},children:[(0,s.jsx)("div",{ref:l,style:{height:"400px",width:"100%"}}),(0,s.jsx)("p",{className:"margin-top--sm",children:"Click on the map to select coordinates."})]}),i&&!i.error&&(0,s.jsxs)("div",{className:"margin-top--md",children:[(0,s.jsxs)("p",{children:[(0,s.jsx)("strong",{children:"Input Coordinates:"})," ",e]}),(0,s.jsx)("hr",{style:{margin:"10px 0"}}),(0,s.jsxs)("p",{children:[(0,s.jsx)("strong",{children:"Decimal Degrees (DD):"})," ",i.DecimalDegrees.CoordinateString]}),(0,s.jsxs)("p",{children:[(0,s.jsx)("strong",{children:"Degrees Minutes Seconds (DMS):"})," ",i.DegreesMinutesSeconds.CoordinateString]}),(0,s.jsxs)("p",{children:[(0,s.jsx)("strong",{children:"Degrees Minutes (DM):"})," ",i.DegreesMinutes.CoordinateString]})]}),i?.error&&(0,s.jsx)("p",{className:"margin-top--md text--danger",children:i.error})]})})}}}]);