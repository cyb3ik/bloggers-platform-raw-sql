export interface BaseRepository<TEntity> {

    save(entity: TEntity): Promise<void>

    findEntityById(id: string): Promise<TEntity | null>
}