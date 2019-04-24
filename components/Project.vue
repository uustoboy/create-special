<template>
  <div class="special-main" :style="widthHeight" v-if="base64">
    <img v-show="widthHeight" :src="base64"
         class="put-img" />
    <vue-drag v-if="item"
    	v-for="item in dragArray"
    	:key="item.dragID"
    	:dragID="item.dragID"
    	:dragHeight="item.dragHeight"
    	:dragCursor="item.dragCursor"
    	:dragZIndex="item.dragZIndex"
			@drageEvent="getDrag"
    >
   		<div class="drage-close"
             @click="deleteDrag(item.dragID)"></div>
    </vue-drag>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Components  } from 'vue-property-decorator';// @ is an alias to /src
import vueDrag from "./Vue-drag.vue";
import { mapMutations } from 'vuex'
import { State, Mutation } from "vuex-class";


@Component({
  components: {
    vueDrag
	}
})

export default class Project extends Vue {

	@Prop(String) readonly base64!: string;
	@Mutation private deleteDrag!: (id: string) => void;
	@Mutation private moveDrag!: (drag: array) => void;
	@Mutation private setUploadingImgHeight!: (h: number) => void;



	widthHeight = {}

	get dragArray () {
      return this.$store.state.dragArray
    }

	width = 100;
	height = 200;
	top = 0;
	left = 0;


	@Watch('base64')
	onImgWidthHeightChanged(val: string, oldVal: string) {
		const image = new Image();
	    image.src = this.base64;
	    image.onload = () => {
	        this.widthHeight = {
	        	width: `${image.width}px`,
	        	height: `${image.height}px`
			}
			this.setUploadingImgHeight(image.height);
	    }
	}

	mounted(){
  }


	getDrag (drag) {
		this.moveDrag(drag);
	}

}
</script>
<style lang="scss">
.special-main{
	@include rel();
	@include mar(0 auto 50);
}
.drage-close{
	@include abs((t:5,r:5,w:22,h:22,z:1));
	@include bgi('../assets/close.png',$position:0 0);
	@include cur;
}
</style>
