"""Renders a visual reference, not a functioning React Native application."""
from pathlib import Path
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import cairosvg
ROOT=Path(__file__).resolve().parent
ICON=ROOT/'assets/icons/softcare'
W,H=1540,960
img=Image.new('RGB',(W,H),'#F5F8F5'); dr=ImageDraw.Draw(img)
try:
    def f(sz,b=False): return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if b else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',sz)
except:
    def f(sz,b=False): return ImageFont.load_default()
COL={'dark':'#263D33','sub':'#5D756A','brand':'#2F7659','mint':'#E0F1E7','canvas':'#F7FAF8','blue':'#E4F0F8','white':'#FFFFFF','stroke':'#DDE9E0'}

def rounded(xy,fill,r=20,outline=None,w=1): dr.rounded_rectangle(xy,radius=r,fill=fill,outline=outline,width=w)
def t(x,y,txt,sz=19,color='dark',bold=False): dr.text((x,y),txt,font=f(sz,bold),fill=COL.get(color,color))
def icon(name,x,y,size):
    data=cairosvg.svg2png(url=str(ICON/(name+'.svg')),output_width=size,output_height=size)
    im=Image.open(BytesIO(data)).convert('RGBA');img.paste(im,(x,y),im)

t(46,31,'DOSECERTA  /  SOFTCARE',30,bold=True)
t(47,80,'Estudo de layout: telefone compacto e tablet • escala e dimensões ilustrativas',18,'sub')

# phone
rounded((42,126,460,907),'#C9DAD0',40)
rounded((49,133,453,900),COL['canvas'],33)
rounded((187,141,311,152),'#B8C7BC',8)
t(75,184,'KAlarm',29,bold=True)
icon('settings',385,183,34)
t(75,231,'Bom dia! Sua rotina está organizada.',17,'sub')
rounded((72,281,432,510),COL['mint'],25)
icon('alarm',353,305,54)
t(93,304,'PRÓXIMO LEMBRETE',14,'brand',True)
t(92,340,'08:00',43,bold=True)
t(92,398,'Medicamento A',21,bold=True)
t(92,432,'1 comprimido • hoje',17,'sub')
rounded((91,466,412,496),COL['brand'],14)
t(144,470,'Ver lembrete',17,'#FFFFFF',True)
t(75,542,'Seus medicamentos',21,bold=True)
rounded((72,588,432,674),COL['white'],18,COL['stroke'])
rounded((84,600,146,663),COL['blue'],15);icon('pill',94,608,44)
t(163,607,'Medicamento A',17,bold=True)
t(163,635,'Hoje • 08:00',15,'sub')
rounded((72,691,432,777),COL['white'],18,COL['stroke'])
rounded((84,704,146,765),COL['mint'],15);icon('drops',94,712,44)
t(163,708,'Medicamento B',17,bold=True)
t(163,735,'Hoje • 20:00',15,'sub')
rounded((69,816,432,876),COL['white'],22,COL['stroke'])
for i,(ico,lab) in enumerate([('home','Início'),('medicines','Remédios'),('calendar','Agenda'),('history','Histórico')]):
    xx=94+i*89;icon(ico,xx,823,27);t(xx-9,855,lab,12,'brand' if i==0 else 'sub',i==0)

# tablet
rounded((505,152,1491,821),'#CBDAD1',37)
rounded((512,159,1484,814),COL['canvas'],30)
# rail
rounded((523,176,633,794),COL['white'],24,COL['stroke'])
icon('pill',548,198,55)
for i,(ico,lab) in enumerate([('home','Início'),('medicines','Remédios'),('calendar','Agenda'),('history','Histórico'),('settings','Ajustes')]):
    yy=324+i*85
    if i==2:rounded((534,yy-8,622,yy+65),COL['mint'],18)
    icon(ico,560,yy,33)
    t(550,yy+42,lab,12,'brand' if i==2 else 'sub',i==2)
# center
x=657
t(x,198,'Sua programação',27,bold=True)
t(x,242,'Confira as doses antes de ativar os lembretes.',17,'sub')
rounded((650,300,1121,762),COL['white'],22,COL['stroke'])
t(674,326,'Semana personalizada',20,bold=True)
t(674,364,'Escolha um dia para ajustar seus horários',15,'sub')
for i,(day,qty) in enumerate([('S',1),('T',2),('Q',3),('Q',4),('S',1),('S',2),('D',3)]):
    xx=672+i*63
    rounded((xx,412,xx+51,487),COL['mint'] if i==0 else '#F1F6F3',12)
    t(xx+17,424,day,14,'brand',True)
    t(xx+17,450,str(qty),20,bold=True)
t(674,516,'Segunda-feira',19,bold=True)
rounded((672,555,1099,625),'#F7FAF8',14)
icon('clock',687,566,42)
t(740,562,'08:00',20,bold=True)
t(740,590,'1 comprimido',16,'sub')
icon('edit',1047,575,30)
rounded((672,651,1099,718),COL['mint'],14)
icon('plus',704,669,31)
t(751,667,'Adicionar horário',17,'brand',True)
# right editor
rounded((1141,300,1466,762),COL['white'],22,COL['stroke'])
t(1162,325,'Editar dose',21,bold=True)
t(1162,366,'Segunda-feira • 08:00',15,'sub')
rounded((1161,408,1441,515),'#F1F7F3',15)
t(1190,423,'QUANTIDADE',14,'brand',True)
icon('plus',1370,453,36)
t(1287,461,'1',25,bold=True)
rounded((1162,553,1441,624),COL['blue'],14)
t(1180,562,'Unidade',14,'sub')
t(1180,582,'Comprimido',18,bold=True)
rounded((1162,669,1441,729),COL['brand'],14)
t(1250,684,'Salvar dose',18,'#FFFFFF',True)

t(547,855,'Tablet: navegação lateral, calendário e editor simultâneos.',18,'sub')
img.save(ROOT/'softcare-responsive-preview.png')
print(ROOT/'softcare-responsive-preview.png')
