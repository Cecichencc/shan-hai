"""Reproducible lightweight GLB characters; Python standard library only.
Run: python3 tools/generate_models.py
Authored palette is sRGB; glTF baseColorFactor stores linear values.
"""
from pathlib import Path
import json, math, struct

DEST = Path(__file__).resolve().parents[1] / 'public' / 'models'
COLORS = {'cream':'fff1db','light':'fff8e9','peach':'ffd8aa','coral':'ed7752',
          'amber':'ffa23e','gold':'ffc75d','skin':'edb98c','shorts':'554537',
          'hair':'4c3025','hair2':'62402c','shirt':'fffdf2','shoe':'eee6cc','sole':'ad9c81','eye':'302723'}

def linear(v):
    v = v / 255
    return v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4

class Builder:
    def __init__(self, root):
        self.doc={'asset':{'version':'2.0','generator':'Shan Hai garden asset builder'},'scene':0,
                  'scenes':[{'nodes':[0]}],'nodes':[{'name':root,'children':[]}],
                  'meshes':[],'materials':[],'accessors':[],'bufferViews':[]}
        self.bin=bytearray(); self.materials={}; self.ids={root:0}; self.root_name=root
    def node(self,name,pos=(0,0,0),parent=None,angle=0):
        n={'name':name,'translation':list(pos),'children':[]}
        if angle:n['rotation']=[0,0,math.sin(angle/2),math.cos(angle/2)]
        index=len(self.doc['nodes']);self.doc['nodes'].append(n);self.ids[name]=index
        self.doc['nodes'][self.ids[parent or self.root_name]]['children'].append(index)
        return index
    def accessor(self,values,components,index=False):
        while len(self.bin)%4:self.bin.append(0)
        offset=len(self.bin);fmt='H' if index else 'f'
        flat=values if components==1 else [x for row in values for x in row]
        self.bin.extend(struct.pack('<'+fmt*len(flat),*flat))
        view=len(self.doc['bufferViews']);self.doc['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':len(self.bin)-offset,'target':34963 if index else 34962})
        a={'bufferView':view,'componentType':5123 if index else 5126,'count':len(values),'type':'SCALAR' if components==1 else 'VEC3'}
        if not index:
            a['min']=[min(v[k] for v in values) for k in range(components)]
            a['max']=[max(v[k] for v in values) for k in range(components)]
        result=len(self.doc['accessors']);self.doc['accessors'].append(a);return result
    def material(self,key):
        if key not in self.materials:
            h=COLORS[key];rgb=[linear(int(h[i:i+2],16)) for i in (0,2,4)]
            self.materials[key]=len(self.doc['materials'])
            self.doc['materials'].append({'name':key,'pbrMetallicRoughness':{'baseColorFactor':rgb+[1],'roughnessFactor':.92,'metallicFactor':0}})
        return self.materials[key]
    def blob(self,name,scale,pos,color,parent=None,angle=0,segments=16,rings=10):
        vertices=[];normals=[];indices=[]
        for row in range(rings+1):
            a=math.pi*row/rings
            for col in range(segments+1):
                b=2*math.pi*col/segments
                unit=(math.sin(a)*math.cos(b),math.cos(a),math.sin(a)*math.sin(b))
                vertices.append([unit[k]*scale[k] for k in range(3)])
                n=[unit[k]/scale[k] for k in range(3)];l=math.sqrt(sum(x*x for x in n));normals.append([x/l for x in n])
        for row in range(rings):
            for col in range(segments):
                a=row*(segments+1)+col;b=a+segments+1
                indices.extend([a,a+1,b,a+1,b+1,b])
        p=self.accessor(vertices,3);n=self.accessor(normals,3);i=self.accessor(indices,1,True)
        mesh=len(self.doc['meshes']);self.doc['meshes'].append({'name':name,'primitives':[{'attributes':{'POSITION':p,'NORMAL':n},'indices':i,'material':self.material(color)}]})
        node=self.node(name,pos,parent,angle);self.doc['nodes'][node]['mesh']=mesh
    def save(self,name):
        self.doc['buffers']=[{'byteLength':len(self.bin)}]
        header=json.dumps(self.doc,separators=(',',':')).encode();header+=b' '*((-len(header))%4)
        self.bin+=b'\0'*((-len(self.bin))%4)
        body=struct.pack('<II',len(header),0x4E4F534A)+header+struct.pack('<II',len(self.bin),0x004E4942)+self.bin
        DEST.mkdir(parents=True,exist_ok=True)
        path=DEST/name;path.write_bytes(struct.pack('<4sII',b'glTF',2,len(body)+12)+body)
        print(f'{name}: {len(self.doc["meshes"])} meshes, {path.stat().st_size:,} bytes')

def make_dijiang():
    b=Builder('SpiritRoot')
    b.blob('Body',(1.02,1.00,.94),(0,1.35,0),'cream',segments=28,rings=18)
    # Subtle overlapping hem shapes; keep a single round body silhouette.
    for i in range(9):
        a=i*2*math.pi/9
        b.blob(f'Hem_{i}',(.30,.35,.16),(.80*math.cos(a),.79,.79*math.sin(a)),'cream',angle=.12*math.cos(a))
    for side in [-1,1]:
        for row in range(3):
            n=f'Leg_{"L" if side<0 else "R"}_{row+1}'
            b.node(n,(side*.69,.61,(row-1)*.63))
            b.blob(n+'_Leg',(.235,.34,.235),(0,-.14,0),'cream',n)
            b.blob(n+'_Hoof',(.24,.14,.255),(0,-.43,-.045),'coral',n)
        for upper in [True,False]:
            n=f'Wing_{"L" if side<0 else "R"}_{"Upper" if upper else "Lower"}'
            b.node(n,(side*.88,1.73 if upper else 1.20,-.38 if upper else .47))
            b.blob(n+'_Palm',(.40,.20,.135),(side*.24,.13,0),'amber',n,angle=side*.32)
            for i in range(4):
                angle=-side*(.68+i*.24 if upper else 1.12+i*.23)
                x=side*(.30+i*.125);y=(.28-i*.055 if upper else .02-i*.075)
                b.blob(n+f'_Feather_{i}',(.155,.51-i*.035,.105),(x,y,0),'coral',n,angle=angle)
                b.blob(n+f'_Gold_{i}',(.115,.33-i*.02,.062),(x-side*.08,y-.06,-.094),'gold' if i%2==0 else 'amber',n,angle=angle)
    b.save('dijiang.glb')

def make_traveler():
    b=Builder('TravelerRoot')
    b.blob('Torso',(.40,.44,.27),(0,1.24,0),'shirt',segments=20,rings=12)
    b.blob('Shorts',(.37,.22,.28),(0,.87,0),'shorts')
    b.blob('Neck',(.115,.14,.115),(0,1.67,0),'skin')
    b.blob('Head',(.45,.46,.41),(0,2.07,-.025),'skin',segments=24,rings=16)
    b.blob('Hair_Cap',(.477,.33,.435),(0,2.26,.04),'hair',segments=24,rings=14)
    for i in range(7):
        a=i*2*math.pi/7
        b.blob(f'Hair_Lock_{i}',(.19,.21,.14),(.34*math.cos(a),2.25,.32*math.sin(a)),'hair2' if i%3==0 else 'hair',angle=.3*math.cos(a))
    for side in [-1,1]:
        b.blob('Eye_'+('L' if side<0 else 'R'),(.035,.052,.018),(side*.155,2.05,-.407),'eye',segments=10,rings=8)
        arm='Arm_'+('L' if side<0 else 'R');b.node(arm,(side*.38,1.48,0))
        b.blob(arm+'_Sleeve',(.16,.205,.18),(side*.065,-.07,0),'shirt',arm,angle=side*.22)
        b.blob(arm+'_Skin',(.104,.255,.112),(side*.105,-.35,0),'skin',arm,angle=side*.08)
        leg='Leg_'+('L' if side<0 else 'R');b.node(leg,(side*.205,.82,0))
        b.blob(leg+'_Short',(.177,.19,.21),(0,-.105,0),'shorts',leg)
        b.blob(leg+'_Calf',(.105,.23,.115),(0,-.39,0),'skin',leg)
        b.blob(leg+'_Sole',(.163,.055,.255),(0,-.697,-.075),'sole',leg)
        b.blob(leg+'_Shoe',(.16,.115,.25),(0,-.60,-.075),'shoe',leg)
    # No bag or strap: approved simplification, 10 October 2026.
    b.save('traveler.glb')

if __name__=='__main__':
    make_dijiang();make_traveler()
