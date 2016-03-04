/**
 * Created by bqxu on 16/2/2.
 */

let {xy4angle,angle4RadianLength}=require('./scale');
export let line = (start = {}, end = {}) => {
  let {x:startX=0,y:startY=0}=start;
  let {x:endX=0,y:endY=0}=end;
  return `M${startX} ${startY}L${endX} ${endY}Z`;
};

export let ring = (r, startAngle = 0, endAngle = 180, width = 5) => {
  if (!r) {
    return
  }
  let outR = r + width;
  let inR = r - width;
  let angle = angle4RadianLength(r, width);
  if (startAngle > endAngle) {
    angle = 0 - angle;
  }
  let {x:outSX,y:outSY}=xy4angle(startAngle + angle, outR);
  let {x:outEX,y:outEY}=xy4angle(endAngle, outR);
  let {x:midSX,y:midSY}=xy4angle(startAngle, r);
  let {x:midEX,y:midEY}=xy4angle(endAngle - angle, r);
  let {x:inSX,y:inSY}=xy4angle(startAngle + angle, inR);
  let {x:inEX,y:inEY}=xy4angle(endAngle, inR);
  let res = [];
  let roundFlag = 1;
  let angleFlag = 0;
  if (endAngle > startAngle) {
    if (endAngle - startAngle > 180) {
      angleFlag = 1;
    }
  } else {
    if (startAngle - endAngle > 180) {
      angleFlag = 1;
    }
    roundFlag = 0;
  }
  res.push(`M${outSX} ${-outSY}`);
  res.push(`A${outR},${outR} 0,${angleFlag},${roundFlag} ${outEX},${-outEY}`);
  res.push(`L${midEX},${-midEY}`);
  res.push(`L${inEX},${-inEY}`);
  res.push(`A${inR},${inR} 0,${angleFlag},${1 - roundFlag} ${inSX},${-inSY}`);
  res.push(`L${midSX},${-midSY}`);
  res.push(`Z`);
  return res.join(" ")
};


export let arc = (r, startAngle = 0, endAngle = 180) => {
  if (!r) {
    return
  }
  let {x:sX,y:sY}=xy4angle(startAngle, r);
  let {x:eX,y:eY}=xy4angle(endAngle, r);
  let res = [];
  let angleFlag = 0;
  let roundFlag = 1;
  if (endAngle - startAngle > 180) {
    angleFlag = 1;
    roundFlag = 0;
  }
  res.push(`M${sX} ${-sY}`);
  res.push(`A${r},${r} 0,${angleFlag},${roundFlag} ${eX},${-eY}`);
  return res.join(" ")
};
