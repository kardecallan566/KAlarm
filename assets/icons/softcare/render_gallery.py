from pathlib import Path
import cairosvg
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
ROOT=Path(__file__).parent
items=sorted(p for p in ROOT.glob('*.svg'))
W,H=1120,1040
im=Image.new('RGB',(W,H),'#F7FAF8')
d=ImageDraw.Draw(im)
try:
  bold=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',29)
  small=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',17)
  mini=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',13)
except: bold=small=mini=ImageFont.load_default()
d.text((42,30),'KAlarm — SoftCare Icons',font=bold,fill='#263D33')
d.text((43,76),f'{len(items)} ícones vetoriais • contornos arredondados • proposta visual v0.1',font=small,fill='#61796B')
cols=7; cellw=144; cellh=174; x0=32; y0=116
for n,svg in enumerate(items):
  r,c=divmod(n,cols); x=x0+c*(cellw+10); y=y0+r*(cellh+3)
  d.rounded_rectangle((x,y,x+cellw,y+cellh-6),radius=22,fill='#FFFFFF',outline='#E1ECE4',width=2)
  d.rounded_rectangle((x+25,y+14,x+cellw-25,y+110),radius=25,fill='#E8F3EC' if r%3==0 else ('#EAF3FA' if r%3==1 else '#FFF2E9'))
  icon=Image.open(BytesIO(cairosvg.svg2png(url=str(svg),output_width=77,output_height=77))).convert('RGBA')
  im.paste(icon,(x+(cellw-77)//2,y+22),icon)
  label=svg.stem.replace('-',' ')
  box=d.textbbox((0,0),label,font=mini); tw=box[2]-box[0]
  d.text((x+(cellw-tw)//2,y+133),label,font=mini,fill='#344D40')
im.save(ROOT.parents[2]/'softcare-preview.png')
print(ROOT.parents[2]/'softcare-preview.png')
