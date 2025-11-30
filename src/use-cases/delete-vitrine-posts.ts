
import { VitrineRepository } from "@/repositories/virine-repository"
interface FetchOrdersRequst{
      VitrineId:number
 
}
export class DeleteVitrineUseCase {
     constructor(private VitrineRepositoy:VitrineRepository){}
     async execute({VitrineId}:FetchOrdersRequst){
        console.log("vitri",VitrineId)
        const Vitrine = await this.VitrineRepositoy.delete(VitrineId)
        return{
            Vitrine
        }
     }
}