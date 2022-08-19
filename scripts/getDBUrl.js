function f() {
  const { username, host, dbname, password, port } = JSON.parse(
    process.env.WWWDB_SECRET
  );
  // DATABASE_URL=postgresql://db_user:db_password@postgres:5432/postgres?schema=public
  return `postgresql://${username}:${password}@${host}:${port}/${dbname}`;
  // return "postgresql://db_user:db_password@postgres:5432/postgres?schema=public";
}
console.log(f());
