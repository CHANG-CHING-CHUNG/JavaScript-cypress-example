export default class FileCopy extends File {
  constructor(bits, filename, options) {
    super(bits, filename, options)
    let webkitRelativePath
    Object.defineProperties(this, {

        webkitRelativePath : { 
            enumerable : true,
            set : function(value){
                webkitRelativePath = value;
            },
            get : function(){
                return webkitRelativePath;
            } 
        },
    });
  }

}