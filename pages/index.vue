<template>
  <section >
    <div class="project-wrapper">
      <div class="aa"></div>
      <h2 class="project-title">
        上传图片生成静态专题
      </h2>
      <Form id="formValidate" ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="right" :label-width="100">
        <FormItem label="上传图片:">
        <label for="upload_file" class="file-Btn">
          上传图片
          <input
            id="upload_file"
            type="file"
            ref="upload_file"
            accept="image/*"
            @change="uploadChange"
          />
        </label>
        <span class="file-info">{{fileInfo}}</span>  
        </FormItem>
        <FormItem label="生成项目名:" prop="name">
          <Input v-model="formValidate.name" placeholder="例如:projectName(最好是英文)"></Input>
        </FormItem>
        <FormItem label="图片截图高度:" prop="height">
          <InputNumber v-model="formValidate.height" :max="1000" :min="10"  placeholder="例如:200"></InputNumber>
        </FormItem>
        <FormItem v-if="imgJpgShow" label="生成图片压缩:" prop="quality">
            <InputNumber
              v-model="formValidate.quality"
              :max="100"
              :min="1"
              placeholder="例如:80"
            ></InputNumber>
        </FormItem>
        <FormItem label="生成专题路径:" prop="path">
            <Input v-model="formValidate.path" type="text" placeholder="例如:E:\"></Input>
        </FormItem>
        <FormItem label="生成图片链接:" prop="link">
            <Input v-model="formValidate.link" type="text" placeholder="例如:http://xxx"></Input>
        </FormItem>
        <FormItem v-if="uploadImg">
          <Button type="primary" @click="addDrag">添加点击区域</Button>
          (点击区域不可重叠)
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">一键生成专题</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
     </Form>
  </div>
  <theme-project :base64="uploadImg"></theme-project>
  <BackTop></BackTop>
  <Load :loadShow="loadShow"></Load>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'

import ThemeProject from '~/components/Project.vue'
import Load from '~/components/Load.vue'
import axios from 'axios'

@Component({
  components: {
    ThemeProject,
    Load
  }
})
export default class Home extends Vue {
  @State private dragArray !: Array
  @State private uploadingImgHeight !: Number
  @Mutation private addDrag!: () => void

  loadShow: boolean = false
  uploadImg: string = ""
  imgType: string  = ''
  fileInfo: string = ''
  imgJpgShow: boolean = false
  formValidate = {
      name: '',
      height: 200,
      quality: 80,
      path: '',
      link: '',
  }

  ruleValidate = {
      name: [
          { required: true, message: '请输入项目名', trigger: 'blur' },
          { type: 'string', message: '必须是字符串类型', trigger: 'blur' }
      ],
      height: [
          { required: true}
      ],
      path: [
          { required: true, message: '请输入专题路径', trigger: 'blur' },
          { type: 'string', message: '必须是字符串类型', trigger: 'blur' }
      ]
  }

  private handleSubmit (name) {
     
    this.$refs[name].validate((valid) => {

      if (valid) {

        let dragArray: Array = [...this.dragArray]
        let originDragArray = dragArray.sort((a, b) => {
          return a.dragTop > b.dragTop ? 1 : -1 // 从小到大排序
        })

        const endDragArray: Array<any> = []
        originDragArray.forEach((item, index) => {
          if (index === 0) {
            if (item.dragTop > 0) {
              endDragArray.push({
                dragTop: 0,
                dragHeight: item.dragTop,
                dragBtn: true
              })
            } else {
              endDragArray.push(item)
            }
          }
          let len = originDragArray.length
          if (index == len - 1) {
            if (this.uploadingImgHeight - (item.dragTop + item.dragHeight) > 0) {
              endDragArray.push({
                dragTop: item.dragTop + item.dragHeight,
                dragHeight: this.uploadingImgHeight - (item.dragTop + item.dragHeight),
                dragBtn: true
              })
            }
            endDragArray.push(item)
          } else {
            endDragArray.push({
              dragTop: item.dragTop + item.dragHeight,
              dragHeight:
                originDragArray[index + 1].dragTop - (item.dragTop + item.dragHeight),
              dragBtn: true
            })
            endDragArray.push(item)
          }
        })

        let endDragArray2 = endDragArray.sort((a, b) => {
          return a.dragTop > b.dragTop ? 1 : -1 // 从小到大排序
        })

        let filesDom = document.getElementById("upload_file")
        let file = filesDom.files[0]
        
        let param = new FormData()

        param.append("file", file, file.name)
        param.append("height", this.formValidate.height)
        param.append("name", this.formValidate.name)
        param.append("path", this.formValidate.path)
        param.append("type", this.imgType)
        param.append("quality",this.formValidate.quality)
        param.append("screenshot", JSON.stringify(endDragArray2))
        if (this.formValidate.link) {
          param.append("link", this.formValidate.link)
        } else {
          param.append("link", "http://static8.baihe.com")
        }

        this.loadShow = true
        axios.post("/upload",param).then(
          (response: any): void => {
            this.loadShow = false
            let res = response.data
            if( res.code == 1 ){
              this.$Modal.success({
                  title: '创建成功！',
                  content: res.data.text
              })
            }else if( res.code == 0 ){
              this.$Modal.warning({
                  title: '创建文件已存在！',
                  content: res.data.text
              }) 
            }else{
              this.$Modal.error({
                  title: '创建失败！',
                  content: '创建失败！'
              }) 
            }
          }
        )

      } else {
          this.$Message.error('大哥填点值呀!')
      }
    })
  }

  private handleReset (name) {
      this.$refs[name].resetFields()
  }

  //上传图片;
  private uploadChange(e: any) {
    const uploadFile = e.target.files[0]
    let fileName = uploadFile.name
    this.fileInfo = fileName
    this.imgType  = fileName.slice(fileName.lastIndexOf(".")+1).toLowerCase()
    this.imgJpgShow = this.imgType  == 'jpg' ? true : false
    const reader = new FileReader()
    reader.readAsDataURL(uploadFile)
    reader.onloadend = (e: any) => {
      this.uploadImg = e.target.result
    }
  }

}

</script>

<style lang="scss" scoped>

body{
  @include bgc(#fafafa);
}

.file-Btn{
  @include rel();
  @include inblock;
  @include pad(0 15);
  @include flc(12,30,#fff);
  @include bgc(#2d8cf0);
  @include over();
  @include trs();
  @include bdrs(4);
  @include cur;
  @include vic;
  &:hover{
    @include bgc(#57a3f3);
  }
}
.file-info{
  @include vic;
  @include flc(12,30,#2d8cf0);
}

#upload_file{
  @include abs((t:-1000,l:-1000,w:0,h:0,z:1));
}

.project-wrapper{
  @include w(500);
  @include mar(0 auto);
}

.project-title{
  @include tac;
  @include flc(30,40,#2d8cf0);
  @include pad(20 0);
}
</style>
