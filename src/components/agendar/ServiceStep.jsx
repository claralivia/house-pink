import Chip from '../ui/Chip.jsx'

export default function ServiceStep({ catalog, selected, onSelect }) {
  return (
    <div className="bk-pros">
      {catalog.map((pro) => (
        <div key={pro.id} className="bk-pro">
          <p className="bk-pro-name">{pro.name}</p>
          {pro.services.map((service) => (
            <div key={service.id} className="bk-service">
              <p className="bk-service-name">{service.name}</p>
              <div className="bk-chips">
                {service.service_types.map((type) => (
                  <Chip
                    key={type.id}
                    active={selected?.type.id === type.id}
                    onClick={() => onSelect({ pro, service, type })}
                  >
                    {type.name}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
