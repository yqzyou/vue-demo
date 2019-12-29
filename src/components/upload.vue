<template>
  <div class="img-module">
      <img :src="fileUrl" />
      <div class="upload-form">
          <input type="file" @change="uploadFn">
      </div>
  </div>
</template>

<script>
import Exif from 'exif-js';
export default {
    data(){
        return{
            imgFile:{},
            fileUrl:'',
            or:1,// 图片旋转信息
        }
    },
    methods:{
        // 监听input 图片
        async uploadFn(e){
            console.log(e)
            let file = e.target.files[0]
            this.or = await this.getImginfo(file,'Orientation')
            console.log(this.or)
            this.transformFileToDataUrl(file)
        },
        // file 转化成dataUrl
        transformFileToDataUrl(file){
            console.log(file)
            this.imgFile.type = file.type || 'image/jpeg'; // 部分安卓出现获取不到type的情况
            this.imgFile.size = file.size;
            this.imgFile.name = file.name;
            const reader = new FileReader();
            const imgCompassMaxSize = 100*1024 // 最大100kb
            // file转dataUrl是个异步函数，要将代码写在回调里
            console.log(this.imgFile)
            reader.readAsDataURL(file);
            reader.onload = e=> {
                const result = e.target.result;
                if(result.length < imgCompassMaxSize) {
                    this.compress(result,this.processData,false);    // 图片不压缩
                } else {
                    this.compress(result,this.processData);            // 图片压缩
                }
            };
            
        },
        // 压缩图片
        compress(dataUrl,callback,flag=true){
            
            const img = new window.Image();
            
            img.src = dataUrl;
            img.onload =  ()=> {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.width;
                canvas.height = img.height;
                let w = canvas.width || img.width;
                let h = canvas.height || img.height;
                this.imgTrate(canvas,img)
                let compressedDataUrl;
                if(flag){
                    compressedDataUrl = canvas.toDataURL(this.imgFile.type, 0.2);
                } else {
                    compressedDataUrl = canvas.toDataURL(this.imgFile.type, 1);
                }
                callback(compressedDataUrl);
            }
        },
        processData(compressedDataUrl){
            this.fileUrl = compressedDataUrl;
        },
        // 获取旋转信息
        getImginfo(file,tag){
            return new Promise(res=>{
                Exif.getData(file, function () {
                    const o = Exif.getTag(this, tag);
                    res(o);
                });
            })
        },
        // 旋转canvas
        imgTrate(canvas,img){
            let or = this.or?this.or:1;
            const w = canvas.width || img.width;
            const h = canvas.height || img.height;
            let ctx = canvas.getContext("2d");
            if(or==1){
                ctx.drawImage(img, 0, 0, w, h);
            }else{
                if(or ==6){ // 90度
                    ctx.rotate(Math.PI / 2)
                    ctx.drawImage(img, 0, -h, w, h);
                }else if(or == 3){ // 180度
                    ctx.rotate(Math.PI)
                    ctx.drawImage(img, -w, -h, w, h);
                }else if(or ==8){ // 270度
                    ctx.rotate(3 * Math.PI / 2)
                    ctx.drawImage(img,-w,0,w,h)
                }
            }
        }
    }
    
}
</script>

<style lang="less" scoped>
    .img-module{
        margin:0 20px;
        background:#eee;
        // padding-top:50%;
        height: 200px;
        box-shadow: 3px 3px 3px #fafafa;
        border-radius: 5px;
        opacity: 0.8;
        position: relative;
        img{
            width:80%;
        }
        .upload-form{
            width:100%;
            // height:100%;
            opacity: 0;
            input{
                position: absolute;
                top:0;
                left:0;
                width:100%;
                height:100%;
            }
        }
    }
</style>