from fastapi import FastAPI,UploadFile,Form,Response, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
#유효하지 않은 계정정보에 대한 예외처리가 가능하게 만들어 줌
from typing import Annotated
import sqlite3

app = FastAPI()

SERCRET = "super-coding" # 사용자 인증에 사용되는 비밀 키
manager = LoginManager(SERCRET, '/login') #토큰을 생성하고 검증하는데 비밀 키를 사용하고 사용자가 인증되지 않았을 때
#/login 해당 url로 리다이렉션된다. 인증이 필요한 경로에 접근하려 할 때 사용자가 로그인 페이지로 이동하도록 설정

@manager.user_loader()
def query_user(data):
    WHERE_STATEMENTS = f'id = "{data}"'
    if type(data) == dict:
        WHERE_STATEMENTS = f'''id = "{data['id']}"'''
    con.row_factory = sqlite3.Row
    cur = con.cursor()  #위치를 업데이트 하기 위해
    user = cur.execute(f"""
                       SELECT * FROM users WHERE {WHERE_STATEMENTS};
                       """).fetchone()
    
   
    return user

@app.post('/login')
def login(id:Annotated[str,Form()],
          password:Annotated[str,Form()]): #앞단에서 해당 api로 아이디와 비밀번호를 들고 요청을 하면
    user = query_user(id) # 입력된 아이디와 일치한 테이블 정보값을 불러온다.
    if not user : # 만약 입력된 아이디와 일치한 아이디가 없으면
        raise InvalidCredentialsException #401 Unauthorized 인가되지않은 유저라는 에러
    elif password != user['password']: # 아이디는 있지만 입력된 비밀번호가 테이블정보에 있는 비밀번호와 다르면
        raise InvalidCredentialsException #401 Unauthorized 인가되지않은 유저라는 에러
    print(user['password'])
    access_token = manager.create_access_token(data={ # 토큰을 생성한다.
       'sub': {
           'id': user['id'], #sub라는 객체를 만들고 그 안에 정보들을 키와 값 형태로 부여
           'name': user['name'],
           'email': user['email']
           }
    })
    
    return {'access_token':access_token}  #액세스토큰을 응답으로 반환
# status code를 따로 지정하지 않으면 자동으로 200 코드를 내려준다

@app.post('/signup')
def signup(id:Annotated[str,Form()],
           password:Annotated[str,Form()],
           name:Annotated[str,Form()],
           email:Annotated[str, Form()]):
    cur.execute(f"""
                INSERT INTO users(id, name, email, password)
                VALUES('{id}','{name}','{email}','{password}')
                """)
    con.commit()
    
    return '200'

con = sqlite3.connect('db.db', check_same_thread=False)
cur = con.cursor()

# 테이블이 없을 때만 테이블을 생성한다
cur.execute(f"""
            CREATE TABLE IF NOT EXISTS items(
	id INTEGER PRIMARY KEY,
	title TEXT NOT NULL,
	image BLOB,
	price INTEGER NOT NULL,
	description TEXT,
	place TEXT NOT NULL,
	insertAt INTEGER NOT NULL
);
            """)

@app.post('/items')
async def create_item(image:UploadFile, 
                title:Annotated[str, Form()], 
                price:Annotated[int, Form()],
                description:Annotated[str, Form()], 
                place:Annotated[str, Form()],
                insertAt:Annotated[int, Form()]
                ):
                
    
    image_bytes = await image.read() #이미지는 용량이 커서 읽는 과정을 await
    cur.execute(f"""
                INSERT INTO items(title,image,price,description,place,insertAt)
                VALUES ('{title}','{image_bytes.hex()}','{price}','{description}','{place}',{insertAt})
                """)  #image_bytes hex로 바꿔서 16진법으로 바꿈. 데이터를 짧게 표시하기 위해서
    
    con.commit()
    
    return '200'

@app.get('/items')
async def get_items(user=Depends(manager)): # 파라미터로 받아오는 액세스 토큰을 체크해서 유효한토큰일때만 응답한다.
   
    con.row_factory = sqlite3.Row  #컬렴명도 같이 불러오는 문법
    cur = con.cursor()  #위치를 업데이트 하기 위해
    rows = cur.execute(f"""
                       SELECT * from items
                       """).fetchall()

    
    return JSONResponse(jsonable_encoder(dict(row)for row in rows))  
    
#{id:1, title:'식칼팝니다'}

@app.get("/images/{item_id}")
async def get_image(item_id):
    cur = con.cursor()
    # 16진법
    image_bytes = cur.execute(f"""
                              SELECT image from items WHERE id={item_id}
                              """).fetchone()[0]
    
    return Response(content=bytes.fromhex(image_bytes), media_type='image/*') #16진법으로 된 것을 byte 코드로 해서 content를 reponse 하겠다.
    




app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend") 
#루트 패스는 맨 마지막에 작성


