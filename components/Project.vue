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
	@State private dragArray !: Array;
	@Mutation private deleteDrag!: (id: string) => void;
	@Mutation private moveDrag!: (drag: array) => void;
	@Mutation private setUploadingImgHeight!: (h: number) => void;

	widthHeight: Object = {}

	@Watch('base64')
	onImgWidthHeightChanged(val: string, oldVal: string) {
		const image = new Image();
	    image.src = this.base64;
	    image.onload = () => {	
	    	const w = image.width + 2;
	    	const h = image.height + 2;
	        this.widthHeight = {
	        	width: `${w}px`,
	        	height: `${h}px`
			}
			this.setUploadingImgHeight(image.height);
	    }
	}

	private getDrag (drag) {
		this.moveDrag(drag);
	}

}
</script>
<style lang="scss">
.special-main{
	@include rel();
	@include mar(0 auto 50);
	@include bd(1 solid #69fffe);
	@include z(1);
}
.drage-close{
	@include abs((t:5,r:5,w:22,h:22,z:1));
	@include bgi('../assets/close.png',$position:0 0);
	@include cur;
}
</style>
