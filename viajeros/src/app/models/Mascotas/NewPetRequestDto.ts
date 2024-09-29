export class NewPetRequestDto {
    canil: boolean;       // Indicador si la mascota está en un canil
    sizeId: number;       // ID del tamaño (referencia a la tabla de tamaños)
    typeId: number;       // ID del tipo (referencia a la tabla de tipos)
    userId: number;       // ID del usuario dueño de la mascota
  
    constructor(
      canil: boolean,
      sizeId: number,
      typeId: number,
      userId: number
    ) {
      this.canil = canil;
      this.sizeId = sizeId;
      this.typeId = typeId;
      this.userId = userId;
    }
  }
  