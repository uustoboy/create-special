<template>
  <div
    class="drage"
    :id="dragID"
    :style="{
        top:top+'px',
        width:width,
        height:height+'px',
        cursor:cursor,
        zIndex:zIndex
    }"
    @mousedown="dragDown($event)"
    @mousemove.prevent="dragMove($event)">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
  @Prop() private drageStyle!: Object;
  @Prop() private dragID!: String;
  @Prop() private dragTop!: String;
  @Prop() private dragHeight!: String;
  @Prop() private dragCursor!: String;
  @Prop() private dragZIndex!: String;
  @Prop() private dragBtn!: Object;

  top = 0;
  left = 0;
  width = '100%';
  height = 200;
  zIndex = 0;
  parentElement = '';
  cursor = 'move';
  mounted(){
    this.parentElement = this.$el;
    this.ID = this.dragID;
    this.top = this.dragTop;
    this.height = this.dragHeight;
    this.cursor = this.dragCursor;
    this.zIndex = this.dragZIndex;
  }
  dir = 'move';
  clickBtn = true;
  dragDown (e: any) {
    this.clickBtn = false;
    let oDrag = this.parentElement;
    let disY = e.clientY - oDrag.offsetTop;
    let yuanY = e.clientY;
    const parentDom = oDrag.parentNode;
    let parentHeight = parentDom.offsetHeight;
    const oDragHeight = oDrag.offsetHeight;
    const oDragTop = oDrag.offsetTop;
    document.onmousemove = (e) => {
      switch ( this.dir ) {
        case "top":
          return false;
          break;
        case "bottom":
          let downHeight:number = e.clientY - yuanY;
          let endDownHeight:number = downHeight + oDragHeight;
          if (endDownHeight <= 30) {
            endDownHeight = 30;
          }
          if (endDownHeight + oDragTop > parentHeight) {
            endDownHeight = parentHeight - oDragTop;
          }
          this.height = endDownHeight;
          return false;
          break;
        case "move":
          let top = e.clientY - disY;
          // 移动当前元素
          if (top < 0) {
            top = 0;
          }
          if (top + oDragHeight > parentHeight) {
            top = parentHeight - oDragHeight;
          }
          this.top = top;
          return false;
          break;
      }
      return false;
    }
    document.onmouseup = (ee: any) => {
      this.clickBtn = true;
      let drage = {
        dragID : this.ID ,
        dragTop: this.top,
        dragHeight: this.height,
        dragCursor: this.cursor,
        dragZIndex: this.zIndex
      }
      this.$emit('drageEvent',drage);
      document.onmousemove = null;
      document.onmouseup = null;
      return false;
    };
  }

  dragMove (e: any){
    if (!this.clickBtn) {
      return (this.clickBtn = false);
    }
    let oDrag = this.parentElement;
    const parentDom = oDrag.parentNode;
    const disY = e.pageY - parentDom.offsetTop;
    let direBtn = "";
    const oDragTop = oDrag.offsetTop;
    const oDragHeight = oDrag.offsetHeight;
    if (disY < oDragTop + 10) {
      direBtn = "top";
    } else if (disY > oDragTop + oDragHeight - 10) {
      direBtn = "bottom";
    } else {
      direBtn = "move";
    }
    switch (direBtn) {
      case "top":
        this.dir = "top";
        return false;
        break;
      case "bottom":
        this.dir = "bottom";
        this.cursor = "n-resize";
        return false;
        break;
      case "move":
        this.dir = "move";
        this.cursor = "move";
        return false;
        break;
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.drage{
  @include abs((t:0,l:0,w:0,h:0,z:1));
  @include bgi('../assets/ico_hotZone.png',$repeat:repeat,$position:0 0);
}
</style>
