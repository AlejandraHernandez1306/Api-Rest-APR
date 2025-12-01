const { z } = require('zod');

// Crear un proyecto excepto 'document'
const projectSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(150, 'El nombre debe tener menos de 150 caracteres'),
    description: z.string().optional(),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha de inicio inválido (YYYY-MM-DD)').optional(),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha de finalización inválido (YYYY-MM-DD)').optional(),
    status: z.number().int().min(1).max(3).default(1), // 1=Activo, 2=En proceso, 3=Finalizado
    leader: z.string().max(120, 'El responsable debe tener menos de 120 caracteres').optional(),
});

// Actualizar
const updateProjectSchema = projectSchema.partial();

module.exports = { projectSchema, updateProjectSchema };