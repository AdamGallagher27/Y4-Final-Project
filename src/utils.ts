

export const findSelectedModel = (models: Collection[], modelName: string) => {
  return models.find((model) => model.name === modelName)
}