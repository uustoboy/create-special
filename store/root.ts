import { GetterTree, ActionContext, ActionTree, MutationTree } from 'vuex'

// import { RootState } from 'store'

export const types = {}

export interface AragArray {
  dragID: string
  dragTop: number
  dragHeight: number
  dragCursor: string
  dragBtn: object
  dragZIndex: string
}

export interface State {
	uploadingImgHeight: number
	dragArray: AragArray[]
}

export const state = (): State => ({
	uploadingImgHeight: 0,
	dragArray: [] 	
})

export const getters: GetterTree<State, RootState> = {}


export interface Actions<S, R> extends ActionTree<S, R> {
  nuxtServerInit (context: ActionContext<S, R>): void
}


export const actions: Actions<State, RootState> = {
  async nuxtServerInit ({ commit }) {
    // const response = await axios.get('/random-data.json', { proxy: { host: '127.0.0.1', port: 3000 } })
    // const staticPeople = response.data.slice(0, 10)
    // commit(`${people.name}/${people.types.SET}`, staticPeople, { root: true })
  }
}

export const mutations: MutationTree<State> = {
	addDrag(state) {
      let stamp = Date.parse(new Date());
      let timestamp = `drag${stamp}`;
      let json = {};
      json.dragID = timestamp;
      json.dragTop = 0;
      json.dragHeight = 100;
      json.dragCursor = "move";
      json.dragBtn = false;
      json.dragZIndex = stamp;
      state.dragArray.push(json);
    },
    moveDrag(state, drag:AragArray[] ) {
      let index = state.dragArray.findIndex(item => {
        return item.dragID === drag.dragID;
      });
      state.dragArray[index] = drag;
    },
    deleteDrag(state, id: string) {
      console.log(state.dragArray.findIndex(item => item.dragID === id));
      state.dragArray.splice(
        state.dragArray.findIndex(item => item.dragID === id),
        1
      );
    },
    setUploadingImgHeight(state, h: number) {
      state.uploadingImgHeight = h;
    }
}