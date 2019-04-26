<template>
  <div class="load-wapper" v-if="loadShow">
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Components  } from 'vue-property-decorator';
import { mapMutations } from 'vuex'
import { State, Mutation } from "vuex-class";


@Component
export default class Load extends Vue {
	@Prop({ default: false }) 
	private loadShow!: Object;
}
</script>
<style lang="scss">
.load-wapper{
	@include fixed((t:0,l:0,w:100%,h:100%,z:100));
  	@include bg(rgba(55,55,55,.6),'../assets/loading.gif',$position:center center);
}
</style>
