export class PetResponseDto {
    idPet: number;        // ID de la mascota
    deleted: boolean;     // Indicador si la mascota está eliminada
    canil: boolean;       // Indicador si la mascota está en un canil
    sizeName: string;     // Nombre del tamaño (por ejemplo: "Chico", "Mediano", "Grande")
    typeName: string;     // Tipo de mascota (por ejemplo: "Perro", "Gato")
    userId: number;       // ID del usuario dueño de la mascota
  
    constructor(
      idPet: number,
      deleted: boolean,
      canil: boolean,
      sizeName: string,
      typeName: string,
      userId: number
    ) {
      this.idPet = idPet;
      this.deleted = deleted;
      this.canil = canil;
      this.sizeName = sizeName;
      this.typeName = typeName;
      this.userId = userId;
    }
  }
  