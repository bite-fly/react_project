let initState=0
export default function counterReducer (preState=initState,action){
    console.log('----reducer调用了----')
    const {type,data}=action
    switch (type) {
        case 'increment':
            return preState+data
        case 'decrement':
            return preState-data
        default:
            return preState
    }
}