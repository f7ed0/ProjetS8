import ctx_generator
import dbgenerator

print("\n-------------------\n".join(ctx_generator.generateCtx("Quels sont les campus de l'UPHF ?",dbgenerator.loadEmbededDB())))

