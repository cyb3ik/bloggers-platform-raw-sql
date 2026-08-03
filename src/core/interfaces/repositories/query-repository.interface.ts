import { PaginatedViewDto } from "../../dto/paginated.view-dto"
import { BaseQueryParams } from "../../dto/query.params.input-dto"

export interface BaseQueryRepository<TViewModel, TQueryParams> {
    getEntityById(id: string): Promise<TViewModel | null>

    getAllEntities(query: TQueryParams): Promise<PaginatedViewDto<TViewModel[]>>
} 