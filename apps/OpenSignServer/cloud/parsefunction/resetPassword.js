export default async function resetPassword(request) {
    const { token, password } = request.params;
    try {
        const query = new Parse.Query(Parse.User);
        query.equalTo('_perishable_token', token); // Asumiendo que guardas un token de restablecimiento en el usuario
        const user = await query.first({ useMasterKey: true });
        if (!user) {
            throw new Parse.Error(404, 'Token no válido o usuario no encontrado');
        }
        user.set('password', password);
        await user.save(null, { useMasterKey: true });
        return { code: 200, message: 'Contraseña restablecida con éxito' };

    } catch (err) {
        const code = err.code || 400;
        const msg = err.message || 'Algo salió mal.';
        throw new Parse.Error(code, msg);
    }
}