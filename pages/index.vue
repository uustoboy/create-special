<template>
  <section >
    <div class="project-wrapper">
      <div class="aa"></div>
      <h2 class="project-title">
        上传图片生成静态专题
      </h2>
      <Form id="formValidate" ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="right" :label-width="100">
        <FormItem label="上传图片:">
          <input
            id="upload_file"
            type="file"
            ref="upload_file"
            accept="image/*"
            @change="uploadChange"
          />
        </FormItem>
        <FormItem label="生成项目名:" prop="name">
          <Input v-model="formValidate.name" placeholder="例如:projectName(最好是英文)"></Input>
        </FormItem>
        <FormItem label="图片截图高度:" prop="height">
          <InputNumber v-model="formValidate.height" :max="1000" :min="1"  placeholder="例如:200"></InputNumber>
        </FormItem>
        <FormItem label="生成图片压缩:" prop="quality">
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
        <FormItem>
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
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'

import ThemeProject from '~/components/Project.vue'
import axios from 'axios'

@Component({
  components: {
    ThemeProject
  }
})
export default class Home extends Vue {
  @State private dragArray !: Array
  @State private uploadingImgHeight !: Number
  @Mutation private addDrag!: () => void

  layerShow = false
  layerTxt = ''

  uploadImg: String = ""
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
          { required: true,message: '请输入截图高度', trigger: 'blur' }
      ],
      quality: [
          //{ required: false, message: '请输入截图压缩比例', trigger: 'blur' }
      ],
      path: [
          { required: true, message: '请输入专题路径', trigger: 'blur' },
          { type: 'string', message: '必须是字符串类型', trigger: 'blur' }
      ],
      link: [
          { required: true, message: '请输入专题图片路径', trigger: 'blur' },
          { type: 'string', message: '必须是字符串类型', trigger: 'blur' }
      ]
  }

  mounted(){

    // this.layerShow = true
  }

  public handleSubmit (name) {
      // this.$refs[name].validate((valid) => {
      //     if (valid) {
      //         this.$Message.success('Success!');
      //     } else {
      //         this.$Message.error('Fail!');
      //     }
      // })

    let originDragArray = this.dragArray.sort((a, b) => {
      return a.dragTop > b.dragTop ? 1 : -1; // 从小到大排序
    });

    const endDragArray: Array<any> = [];
    originDragArray.forEach((item, index) => {
      if (index === 0) {
        if (item.dragTop > 0) {
          endDragArray.push({
            dragTop: 0,
            dragHeight: item.dragTop,
            maskBtn: true
          });
        } else {
          endDragArray.push(item);
        }
      }
      let len = originDragArray.length;
      if (index == len - 1) {
        if (this.uploadingImgHeight - (item.dragTop + item.dragHeight) > 0) {
          endDragArray.push({
            dragTop: item.dragTop + item.dragHeight,
            dragHeight: this.uploadingImgHeight - (item.dragTop + item.dragHeight),
            maskBtn: true
          });
        }
        endDragArray.push(item);
      } else {
        endDragArray.push({
          dragTop: item.dragTop + item.dragHeight,
          dragHeight:
            originDragArray[index + 1].dragTop - (item.dragTop + item.dragHeight),
          maskBtn: true
        });
        endDragArray.push(item);
      }
    });

    let endDragArray2 = endDragArray.sort((a, b) => {
      return a.dragTop > b.dragTop ? 1 : -1; // 从小到大排序
    });


    let filesDom = document.getElementById("upload_file");
    let file = filesDom.files[0];
    let fileName = file.name;
    let type = fileName.slice(fileName.lastIndexOf(".")+1).toLowerCase();
    let param = new FormData();

    console.log(endDragArray2);
    param.append("file", file, file.name);
    param.append("height", this.formValidate.height);
    param.append("name", this.formValidate.name);
    param.append("path", this.formValidate.path);
    param.append("type", type);
    param.append("quality",this.formValidate.quality)

    param.append("screenshot", JSON.stringify(endDragArray2));
    if (this.formValidate.link) {
      param.append("link", this.formValidate.link);
    } else {
      param.append("link", "http://static8.baihe.com/images/");
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };

    axios.post("/upload",param).then(
      (response: any): void => {

      }
    );


    // axios.post("/upload", param, config).then(
    //   (response: any): void => {
    //     this.$Modal.success({
    //         title: '成功',
    //         content: '项目创建成功'
    //     });
    //   }
    // );

    //   this.$refs[name].validate((valid) => {

    //       if (valid) {

    //       } else {
    //           this.$Message.error('大哥填点值呀!');
    //       }
    //   })
  }


  public handleReset (name) {
      this.$refs[name].resetFields();
  }

  //上传图片;
  public uploadChange(e: any) {
    let base64;
    const uploadFile = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadFile);
    reader.onloadend = (e: any) => {
      base64 = e.target.result; // base64就是图片的转换的结果
      this.uploadImg = e.target.result;
    };
  }

}

</script>

<style lang="scss" scoped>

body{
  @include bgc(#fafafa);
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
