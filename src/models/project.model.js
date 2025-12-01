const pool = require('../config/db');

// consulta de actualización dinámicamente
const buildUpdateQuery = (id, data) => {
    const fields = [];
    const values = [];

    // campos que tienen valores definidos
    for (const key in data) {
        // Evita el campo ID en la actualización y verifica que el valor no sea undefined
        if (key !== 'id' && data[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(data[key]);
        }
    }

    values.push(id); 

    if (fields.length === 0) {
        return null; // No se actualiza
    }

    const sql = `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`;
    return { sql, values };
};

const ProjectModel = {
    // Listar todos los proyectos
    findAll: async () => {
        const [rows] = await pool.query('SELECT * FROM projects');
        return rows;
    },

    // Obtener un proyecto por ID
    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
        return rows[0];
    },

    // Crear un proyecto nuevo
    create: async (projectData) => {
        const { name, description, start_date, end_date, status, leader, document } = projectData;

        const sql = `INSERT INTO projects (name, description, start_date, end_date, status, leader, document)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [name, description, start_date, end_date, status, leader, document || null];

        const [result] = await pool.query(sql, values);
        return result.insertId;
    },

    // Actualizar datos de un proyecto
    update: async (id, projectData) => {
        const query = buildUpdateQuery(id, projectData);
        if (!query) return { affectedRows: 0 };

        const [result] = await pool.query(query.sql, query.values);
        return result;
    },

    // Eliminar un proyecto
    remove: async (id) => {
        const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [id]);
        return result;
    }
};

module.exports = ProjectModel;