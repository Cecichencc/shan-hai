"""Shan Hai stylized low-poly character assets.
Pure geometric source of record. Recreate assets with:
    python -m pip install trimesh numpy
    python tools/generate_models.py
Character pivot roots in exported GLB are animated in Three.js.
"""
import numpy as np
import trimesh
from trimesh.transformations import translation_matrix, rotation_matrix
from pathlib import Path
import math

DEST=Path(__file__).resolve().parents[1]/'public'/'models'
DEST.mkdir(parents=True,exist_ok=True)

COLORS={
 'cream':'#fff1dc','light':'#fff8ed','fur':'#f6e4cd','furshadow':'#efdbc4',
 'peach':'#ffd0a9','coral':'#ed8065','red':'#e8755d','amber':'#ffac6e', 'gold':'#ffd28a',
 'skin':'#ffd8ba','shorts':'#756658','hair':'#68554e','hair2':'#806453',
 'sage':'#77998b','sageDark':'#537768','shirt':'#fffef6','white':'#fffdf6',
 'shoe':'#e7e4d8','shoeSole':'#b3bdad','eye':'#453b3b',
 'wood':'#bd8665','roof':'#4d8090','roofLight':'#6f9c9d','stone':'#d8d4bd','stoneDark':'#adbab0'
}

def material(color):
 h=COLORS.get(color,color).lstrip('#')
 rgba=[int(h[i:i+2],16) for i in (0,2,4)]+[255]
 return trimesh.visual.material.PBRMaterial(baseColorFactor=rgba,roughnessFactor=.95,metallicFactor=0.0,doubleSided=True)

def ellipsoid(scale, detail=2):
 m=trimesh.creation.icosphere(subdivisions=detail,radius=1)
 m.apply_scale(scale)
 return m

def box(extents):return trimesh.creation.box(extents=extents)
def cylinder(r,h,segments=10): return trimesh.creation.cylinder(radius=r,height=h,sections=segments)

def tapered_leaf(width=.25,length=.8,thick=.14):
 """Closed low-poly pointed leaf / feather with a plump base and tip."""
 n=7; rings=7; v=[]; f=[]
 for k in range(rings+1):
  t=k/rings
  rad=(math.sin(math.pi*(.015+.97*t))**.70)*(1.02-.40*t)
  for j in range(n):
   a=j*2*math.pi/n
   v.append([width*rad*math.cos(a),length*t,thick*rad*math.sin(a)])
 for k in range(rings):
  for j in range(n):
   a=k*n+j; b=k*n+(j+1)%n; c=(k+1)*n+j; d=(k+1)*n+(j+1)%n
   f.extend([[a,b,c],[b,d,c]])
 for j in range(1,n-1):
  f.append([0,j+1,j])
  f.append([rings*n,rings*n+j,rings*n+j+1])
 return trimesh.Trimesh(vertices=v,faces=f,process=True)

def mat_at(x=0,y=0,z=0, rotz=0, roty=0):
 t=translation_matrix([x,y,z]);
 if roty:t=t @ rotation_matrix(roty,[0,1,0])
 if rotz:t=t @ rotation_matrix(rotz,[0,0,1])
 return t

class Builder:
 def __init__(self):self.scene=trimesh.Scene();self.num=0
 def root(self,name,position=(0,0,0)):
  self.scene.graph.update(frame_to=name,frame_from='world',matrix=translation_matrix(position))
 def add(self,mesh,color,name,position=(0,0,0),parent='world',rotz=0,roty=0):
  self.num+=1
  mesh.visual=trimesh.visual.TextureVisuals(material=material(color))
  self.scene.add_geometry(mesh,node_name=name,geom_name='geo_'+name,parent_node_name=parent,transform=mat_at(*position,rotz=rotz,roty=roty))
 def blob(self,name,scale,pos,color,parent='world',detail=2,rotz=0,roty=0):
  self.add(ellipsoid(scale,detail),color,name,pos,parent,rotz=rotz,roty=roty)
 def leaf(self,name,scale,pos,color,parent='world',rotz=0,roty=0):
  self.add(tapered_leaf(*scale),color,name,pos,parent,rotz=rotz,roty=roty)
 def save(self,path):
  out=DEST/path
  self.scene.export(out)
  print(f'{out.name}: {out.stat().st_size/1024:.1f} KiB · {self.num} shapes · {len(self.scene.graph.nodes_geometry)} named geometry nodes')
  return self.scene


def make_dijiang():
 b=Builder()
 b.root('SpiritRoot')
 b.blob('Body',(1.33,1.16,1.17),(0,1.45,0),'cream',parent='SpiritRoot',detail=3)
 # Layered rounded tufts over the body surface. No eyes, face, nose, ears or whiskers.
 # A soft 'plush' silhouette reads better than hair simulation in mobile WebGL.
 phi=(1+5**.5)/2
 for i in range(108):
  theta=2*math.pi*i/phi
  v=1-2*(i+.5)/108
  sx=math.sqrt(max(0,1-v*v))
  x=1.29*sx*math.cos(theta); z=1.13*sx*math.sin(theta); y=1.45+1.11*v
  if y<.73:continue
  # avoid a dense shell at the very center; varied small petal-shaped fur tiles
  shade=['light','cream','fur','light','cream'][i%5]
  b.blob(f'BodyTuft_{i}',(.23,.275,.20),(x*.98,y,z*.98),shade,'SpiritRoot',detail=1,rotz=.25*math.cos(theta))
 # crown has soft overlapping locks rather than spikes
 for i in range(16):
  a=i*2.3999;r=.14+.61*(i%5)/4
  x=r*math.cos(a);z=r*math.sin(a)
  b.blob(f'Crown_{i}',(.21,.29,.20),(x,2.60,z), 'light' if i%2 else 'cream','SpiritRoot',detail=1,rotz=.30*math.cos(a))
 # cinnabar fur-swirl accents along the two flanks
 for side in [-1,1]:
  for i in range(4):
   x=side*(1.24-.13*abs(i-1.5));z=-.62+i*.40
   y=1.29+.24*math.sin(i*.95)
   b.blob(f'Flame_{"L" if side<0 else "R"}_{i}',(.13,.26,.12),(x,y,z),'coral','SpiritRoot',detail=1,rotz=-side*(.35+i*.15))
 # six distinct short legs (three pairs)
 for side in [-1,1]:
  for row in range(3):
   legname=f'Leg_{"L" if side<0 else "R"}_{row+1}'
   b.root(legname,(side*.91,.65,(row-1)*.64))
   # root in local coordinates; translation adjusted after generation below
   b.blob(legname+'_Tuft',(.43,.51,.40),(0,-.08,0),'light',legname,2)
   b.blob(legname+'_Hoof',(.39,.18,.38),(0,-.48,-.015),'coral',legname,2)
   for k in [-1,0,1]:
    b.leaf(legname+f'_Cap{k}',(.09,.16,.075),(k*.16,-.34,-.18),'cream',legname,rotz=.2*k)
 # four wings in two pairs, physically separated and independently animatable
 for side in [-1,1]:
  for upper in [True,False]:
   wingname='Wing_'+('L' if side<0 else 'R')+('_Upper' if upper else '_Lower')
   b.root(wingname,(side*1.04,2.03 if upper else 1.40,-.35 if upper else .33))
   # broad wing mass gives soft rounded silhouettes, with layered feather lobes.
   b.blob(wingname+'_Base',(.64 if upper else .52,.39 if upper else .31,.23),(side*.46,.18,0),'coral',wingname,detail=2,rotz=-side*.60)
   count=6 if upper else 5
   for i in range(count):
    t=i/(count-1)
    x=side*(.17+i*.17)
    y=(.08+i*.14 if upper else -.07+i*.12)
    length=(.48-.05*t) if upper else (.40-.06*t)
    b.blob(wingname+f'_OuterFeather_{i}',(.22 if upper else .20,length,.15),(x,y,-.04),'coral' if i%2 else 'amber',wingname,detail=1,rotz=-side*(.74+.16*t))
    b.blob(wingname+f'_InnerFeather_{i}',(.19,length*.84,.13),(x-side*.045,y+.10,.17),'gold' if i%2 else 'peach',wingname,detail=1,rotz=-side*(.77+.16*t))
   b.blob(wingname+'_Tip',(.21,.47 if upper else .38,.13),(side*1.02,.54 if upper else .22,-.10),'amber',wingname,detail=1,rotz=-side*.85)
 b.save('dijiang.glb')
 return b


def make_traveler():
 b=Builder(); b.root('TravelerRoot')
 b.blob('Torso',( .56,.64,.35),(0,1.34,0),'shirt','TravelerRoot',2)
 b.blob('Shorts',(.55,.28,.38),(0,.90,0),'shorts','TravelerRoot',2)
 b.blob('Neck',(.17,.20,.18),(0,1.91,-.035),'skin','TravelerRoot',2)
 b.blob('Head',(.57,.55,.51),(0,2.25,-.03),'skin','TravelerRoot',3)
 # Short layered hair (no bun, no ponytail). Back-of-head shell + overlapping locks.
 b.blob('Hair_Cap',(.61,.43,.54),(0,2.51,.03),'hair','TravelerRoot',2)
 for i in range(13):
  a=i*2*math.pi/13
  x=.44*math.cos(a);z=.38*math.sin(a)
  b.leaf(f'Hair_Strand_{i}',(.17,.37,.16),(x,2.49,z+.025),'hair2' if i%3==0 else 'hair','TravelerRoot',rotz=.40*math.cos(a),roty=a)
 # tiny eyes on the front, negative Z, not cartoony outsized circles
 for side in [-1,1]:
  b.blob('Eye_'+('L' if side<0 else 'R'),(.065,.11,.045),(side*.22,2.24,-.513),'eye','TravelerRoot',2)
 # arms as animated parents
 for side in [-1,1]:
  name='Arm_'+('L' if side<0 else 'R')
  b.root(name,(side*.56,1.66,0))
  b.blob(name+'_Sleeve',(.19,.30,.24),(side*.14,-.17,0),'shirt',name,2)
  b.blob(name+'_Hand',(.15,.23,.15),(side*.16,-.59,-.015),'skin',name,2)
 # legs as pivots
 for side in [-1,1]:
  name='Leg_'+('L' if side<0 else 'R')
  b.root(name,(side*.27,.90,0))
  b.blob(name+'_Short',(.24,.27,.25),(0,-.15,0),'shorts',name,2)
  b.blob(name+'_Calf',(.16,.32,.17),(0,-.54,0),'skin',name,2)
  b.blob(name+'_Shoe',(.24,.16,.37),(0,-.76,-.11),'shoe',name,2)
  b.blob(name+'_Sole',(.25,.07,.39),(0,-.875,-.11),'shoeSole',name,1)
 # little sage cross-body satchel
 b.blob('Bag',(.30,.34,.19),(.53,1.08,.13),'sage','TravelerRoot',2)
 b.blob('Bag_Flap',(.30,.12,.205),(.53,1.25,.13),'sageDark','TravelerRoot',2)
 # strap line across chest, slim diagonally oriented leaf-like prism
 b.add(box((.075,1.18,.075)),'sageDark','Bag_Strap',(.18,1.54,-.31),'TravelerRoot',rotz=-.49)
 b.save('traveler.glb')
 return b

if __name__=='__main__':
 make_dijiang();make_traveler()
