export const CotacoesList = () => {
  return (
    <div className="flex w-full flex-col items-center ">
      <div className="card bg-base-100 w-full max-w-xl shadow-xl">
        <div className="card-body grid grid-cols-3">
          <div className="col-span-2">
            <h2 className="card-title">Cotação 01</h2>
            <h3>Enviados: 01/03</h3>
            <h3>Criado: 04/03/2023</h3>
          </div>
          <div className="card-actions items-center justify-center">
            <button className="btn btn-primary">Abrir</button>
          </div>
        </div>
      </div>
      <div className="card bg-base-100 w-full max-w-xl shadow-xl">
        <div className="card-body grid grid-cols-3">
          <div className="col-span-2">
            <h2 className="card-title">Cotação 01</h2>
            <h3>Enviados: 01/03</h3>
            <h3>Criado: 04/03/2023</h3>
          </div>
          <div className="card-actions items-center justify-center">
            <button className="btn btn-primary">Abrir</button>
          </div>
        </div>
      </div>
    </div>
  );
};
