class DoubleLineFont{

   fontUrl; 
   color; 
   message; 
   size;
   xMid;
   matLite;
   matDark;
   
   constructor(fontUrl, color, message, size){
      this.fontUrl = fontUrl;
      this.color = color;
      this.message = message;
      this.size = size;
      
      this.matLite = new THREE.MeshBasicMaterial( {
         color: this.color,
         transparent: true,
         opacity: 0.4,
         side: THREE.DoubleSide
      } );
      
      this.matDark = new THREE.LineBasicMaterial( {
         color: this.color,
         side: THREE.DoubleSide
      });
   }
   
   #createText(geometry){
      geometry.translate(this.xMid, 0, 0 );
      return new THREE.Mesh( geometry, this.matLite );
   }
   
   #createLine(shapes){
      const lineText = new THREE.Object3D();
      shapes.push.apply(shapes, this.#createHoleShapes(shapes));
   
      shapes.forEach(shape =>{
         const points = shape.getPoints();
         const geometry = new THREE.BufferGeometry().setFromPoints( points );
         geometry.translate(this.xMid, 0, 0 );
         const lineMesh = new THREE.Line( geometry, this.matDark );
         lineText.add( lineMesh );
      })
   
      return lineText;
   }
   
   #createHoleShapes(shapes){
      const holeShapes = [];
      shapes.forEach(e => {
         if (e.holes) e.holes.forEach(hole => {holeShapes.push( hole )});
      })
      return holeShapes;
   }
   
   async createLineText(){
      let font = await this.#loadFont(this.fontUrl);      
      const shapes = font.generateShapes(this.message, this.size);
      const geometry = new THREE.ShapeGeometry(shapes);
      geometry.computeBoundingBox();
      this.xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
      
      let text = this.#createText(geometry);
      let lineText = this.#createLine(shapes);   
      
      text.position.set(150,50,-70);
      lineText.position.set(150,50,-69.5);
      
      return {'text':text,'lineText':lineText};
   }
}

