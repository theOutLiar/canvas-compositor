import { Vector } from 'vectorious/withoutblas';

let instance = null;
export default class VectorAdaptor{
    constructor(implementation){
        //this is a singleton because any given runtime only needs one implementation of Vector
        if(instance){
            return instance;
        }

        //could do some API checking to see if things are compatible for different vector libs
        //and write a facade for vector altogether... but that seems like a lot of work.
        //more docs to come, but this assumes Vectorious is being used.
        if(!implementation){
            implementation = Vector;
        }

        this._implementation = implementation;
        instance = this;
    }

    get implementation() {
        return this._implementation;
    }
}
