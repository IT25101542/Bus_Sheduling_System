package com.lankatransit.system.tripplanning;

import com.lankatransit.system.exception.ConflictException;
import com.lankatransit.system.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripPlanningService {

    private final BusRepository busRepository;
    private final DriverRepository driverRepository;
    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;
    private final ScheduleRepository scheduleRepository;
    private final DelayLogRepository delayLogRepository;

    public TripPlanningService(BusRepository busRepository,
                               DriverRepository driverRepository,
                               RouteRepository routeRepository,
                               RouteStopRepository routeStopRepository,
                               ScheduleRepository scheduleRepository,
                               DelayLogRepository delayLogRepository) {
        this.busRepository = busRepository;
        this.driverRepository = driverRepository;
        this.routeRepository = routeRepository;
        this.routeStopRepository = routeStopRepository;
        this.scheduleRepository = scheduleRepository;
        this.delayLogRepository = delayLogRepository;
    }

    // ==========================================
    // BUS CRUD
    // ==========================================
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    public Bus getBusById(Long id) {
        return busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + id));
    }

    @Transactional
    public Bus createBus(BusDto dto) {
        if (busRepository.findByBusNumber(dto.getBusNumber()).isPresent()) {
            throw new ConflictException("Bus number already exists: " + dto.getBusNumber());
        }
        if (busRepository.findByRegistrationNumber(dto.getRegistrationNumber()).isPresent()) {
            throw new ConflictException("Registration number already exists: " + dto.getRegistrationNumber());
        }
        Bus bus = new Bus(
                dto.getBusNumber(),
                dto.getRegistrationNumber(),
                dto.getCapacity(),
                dto.getBusType(),
                dto.getStatus(),
                dto.getDepotLocation(),
                dto.isAirConditioned()
        );
        return busRepository.save(bus);
    }

    @Transactional
    public Bus updateBus(Long id, BusDto dto) {
        Bus bus = getBusById(id);
        bus.setBusNumber(dto.getBusNumber());
        bus.setRegistrationNumber(dto.getRegistrationNumber());
        bus.setCapacity(dto.getCapacity());
        bus.setBusType(dto.getBusType());
        bus.setStatus(dto.getStatus());
        bus.setDepotLocation(dto.getDepotLocation());
        bus.setAirConditioned(dto.isAirConditioned());
        return busRepository.save(bus);
    }

    @Transactional
    public void deleteBus(Long id) {
        Bus bus = getBusById(id);
        busRepository.delete(bus);
    }

    // ==========================================
    // DRIVER CRUD
    // ==========================================
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public Driver getDriverById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));
    }

    @Transactional
    public Driver createDriver(DriverDto dto) {
        if (driverRepository.findByDriverCode(dto.getDriverCode()).isPresent()) {
            throw new ConflictException("Driver code already exists: " + dto.getDriverCode());
        }
        if (driverRepository.findByLicenseNumber(dto.getLicenseNumber()).isPresent()) {
            throw new ConflictException("Driver license already exists: " + dto.getLicenseNumber());
        }
        Driver driver = new Driver(
                dto.getDriverCode(),
                dto.getFullName(),
                dto.getLicenseNumber(),
                dto.getPhone(),
                dto.getStatus(),
                dto.getAssignedDepot()
        );
        return driverRepository.save(driver);
    }

    @Transactional
    public Driver updateDriver(Long id, DriverDto dto) {
        Driver driver = getDriverById(id);
        driver.setDriverCode(dto.getDriverCode());
        driver.setFullName(dto.getFullName());
        driver.setLicenseNumber(dto.getLicenseNumber());
        driver.setPhone(dto.getPhone());
        driver.setStatus(dto.getStatus());
        driver.setAssignedDepot(dto.getAssignedDepot());
        return driverRepository.save(driver);
    }

    @Transactional
    public void deleteDriver(Long id) {
        Driver driver = getDriverById(id);
        driverRepository.delete(driver);
    }

    // ==========================================
    // ROUTE CRUD
    // ==========================================
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Route getRouteById(Long id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));
    }

    @Transactional
    public Route createRoute(RouteDto dto) {
        if (routeRepository.findByRouteNumber(dto.getRouteNumber()).isPresent()) {
            throw new ConflictException("Route number already exists: " + dto.getRouteNumber());
        }
        Route route = new Route(
                dto.getRouteNumber(),
                dto.getOrigin(),
                dto.getDestination(),
                dto.getDistanceKm(),
                dto.getEstimatedDurationMins(),
                dto.getBaseFare()
        );
        route.setActive(dto.isActive());
        Route savedRoute = routeRepository.save(route);

        if (dto.getStopNames() != null && !dto.getStopNames().isEmpty()) {
            int order = 1;
            double step = dto.getDistanceKm() / (dto.getStopNames().size() + 1);
            for (String stopName : dto.getStopNames()) {
                RouteStop stop = new RouteStop(savedRoute, stopName, order, Math.round(order * step * 10.0) / 10.0);
                routeStopRepository.save(stop);
                order++;
            }
        }
        return savedRoute;
    }

    @Transactional
    public Route updateRoute(Long id, RouteDto dto) {
        Route route = getRouteById(id);
        route.setRouteNumber(dto.getRouteNumber());
        route.setOrigin(dto.getOrigin());
        route.setDestination(dto.getDestination());
        route.setDistanceKm(dto.getDistanceKm());
        route.setEstimatedDurationMins(dto.getEstimatedDurationMins());
        route.setBaseFare(dto.getBaseFare());
        route.setActive(dto.isActive());
        return routeRepository.save(route);
    }

    @Transactional
    public void deleteRoute(Long id) {
        Route route = getRouteById(id);
        routeRepository.delete(route);
    }

    // ==========================================
    // SCHEDULE CRUD & CONFLICT CHECKING
    // ==========================================
    public List<ScheduleDto> getAllSchedules() {
        return scheduleRepository.findAll().stream()
                .map(this::mapToScheduleDto)
                .collect(Collectors.toList());
    }

    public ScheduleDto getScheduleById(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));
        return mapToScheduleDto(schedule);
    }

    @Transactional
    public ScheduleDto createSchedule(ScheduleDto dto) {
        if (scheduleRepository.findByScheduleCode(dto.getScheduleCode()).isPresent()) {
            throw new ConflictException("Schedule code already exists: " + dto.getScheduleCode());
        }

        // Validate conflict
        validateConflict(dto.getBusId(), dto.getDriverId(), dto.getDepartureTime(), dto.getArrivalTime(), null);

        Route route = getRouteById(dto.getRouteId());
        Bus bus = getBusById(dto.getBusId());
        Driver driver = getDriverById(dto.getDriverId());

        Schedule schedule = new Schedule(
                dto.getScheduleCode(),
                route,
                bus,
                driver,
                dto.getDepartureTime(),
                dto.getArrivalTime(),
                dto.getFrequency(),
                dto.getStatus(),
                dto.getEffectiveFrom(),
                dto.getEffectiveTo()
        );
        Schedule saved = scheduleRepository.save(schedule);
        return mapToScheduleDto(saved);
    }

    @Transactional
    public ScheduleDto updateSchedule(Long id, ScheduleDto dto) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));

        validateConflict(dto.getBusId(), dto.getDriverId(), dto.getDepartureTime(), dto.getArrivalTime(), id);

        Route route = getRouteById(dto.getRouteId());
        Bus bus = getBusById(dto.getBusId());
        Driver driver = getDriverById(dto.getDriverId());

        schedule.setScheduleCode(dto.getScheduleCode());
        schedule.setRoute(route);
        schedule.setBus(bus);
        schedule.setDriver(driver);
        schedule.setDepartureTime(dto.getDepartureTime());
        schedule.setArrivalTime(dto.getArrivalTime());
        schedule.setFrequency(dto.getFrequency());
        schedule.setStatus(dto.getStatus());
        schedule.setEffectiveFrom(dto.getEffectiveFrom());
        schedule.setEffectiveTo(dto.getEffectiveTo());

        Schedule updated = scheduleRepository.save(schedule);
        return mapToScheduleDto(updated);
    }

    @Transactional
    public void deleteSchedule(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));
        scheduleRepository.delete(schedule);
    }

    /**
     * Business Rule: Prevent bus or driver double-booking on overlapping active trips.
     */
    public void validateConflict(Long busId, Long driverId, String depTime, String arrTime, Long excludeScheduleId) {
        List<Schedule> busSchedules = scheduleRepository.findByBusId(busId);
        for (Schedule s : busSchedules) {
            if (excludeScheduleId != null && s.getId().equals(excludeScheduleId)) continue;
            if (!"ACTIVE".equalsIgnoreCase(s.getStatus())) continue;
            if (isTimeOverlap(depTime, arrTime, s.getDepartureTime(), s.getArrivalTime())) {
                throw new ConflictException("Schedule conflict: Bus is already assigned to active schedule "
                        + s.getScheduleCode() + " between " + s.getDepartureTime() + " and " + s.getArrivalTime());
            }
        }

        List<Schedule> driverSchedules = scheduleRepository.findByDriverId(driverId);
        for (Schedule s : driverSchedules) {
            if (excludeScheduleId != null && s.getId().equals(excludeScheduleId)) continue;
            if (!"ACTIVE".equalsIgnoreCase(s.getStatus())) continue;
            if (isTimeOverlap(depTime, arrTime, s.getDepartureTime(), s.getArrivalTime())) {
                throw new ConflictException("Schedule conflict: Driver is already assigned to active schedule "
                        + s.getScheduleCode() + " between " + s.getDepartureTime() + " and " + s.getArrivalTime());
            }
        }
    }

    private boolean isTimeOverlap(String start1, String end1, String start2, String end2) {
        int s1 = parseTime(start1);
        int e1 = parseTime(end1);
        int s2 = parseTime(start2);
        int e2 = parseTime(end2);
        return s1 < e2 && e1 > s2;
    }

    private int parseTime(String time) {
        try {
            String[] parts = time.split(":");
            return Integer.parseInt(parts[0].trim()) * 60 + Integer.parseInt(parts[1].trim());
        } catch (Exception e) {
            return 0;
        }
    }

    private ScheduleDto mapToScheduleDto(Schedule s) {
        ScheduleDto dto = new ScheduleDto();
        dto.setId(s.getId());
        dto.setScheduleCode(s.getScheduleCode());
        dto.setRouteId(s.getRoute().getId());
        dto.setRouteName(s.getRoute().getRouteNumber() + " (" + s.getRoute().getOrigin() + " - " + s.getRoute().getDestination() + ")");
        dto.setBusId(s.getBus().getId());
        dto.setBusNumber(s.getBus().getBusNumber() + " [" + s.getBus().getRegistrationNumber() + "]");
        dto.setDriverId(s.getDriver().getId());
        dto.setDriverName(s.getDriver().getFullName() + " (" + s.getDriver().getDriverCode() + ")");
        dto.setDepartureTime(s.getDepartureTime());
        dto.setArrivalTime(s.getArrivalTime());
        dto.setFrequency(s.getFrequency());
        dto.setStatus(s.getStatus());
        dto.setEffectiveFrom(s.getEffectiveFrom());
        dto.setEffectiveTo(s.getEffectiveTo());
        return dto;
    }

    // ==========================================
    // DELAY CRUD
    // ==========================================
    public List<DelayDto> getAllDelays() {
        return delayLogRepository.findAllByOrderByReportedAtDesc().stream()
                .map(this::mapToDelayDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public DelayDto logDelay(DelayDto dto) {
        Schedule schedule = scheduleRepository.findById(dto.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found: " + dto.getScheduleId()));

        DelayLog delay = new DelayLog(
                schedule,
                dto.getDelayMinutes(),
                dto.getDelayReason(),
                dto.getUpdatedDepartureTime(),
                dto.getReportedBy()
        );
        DelayLog saved = delayLogRepository.save(delay);
        return mapToDelayDto(saved);
    }

    @Transactional
    public void deleteDelay(Long id) {
        DelayLog log = delayLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delay log not found: " + id));
        delayLogRepository.delete(log);
    }

    private DelayDto mapToDelayDto(DelayLog d) {
        DelayDto dto = new DelayDto();
        dto.setId(d.getId());
        dto.setScheduleId(d.getSchedule().getId());
        dto.setScheduleCode(d.getSchedule().getScheduleCode());
        dto.setRouteName(d.getSchedule().getRoute().getOrigin() + " -> " + d.getSchedule().getRoute().getDestination());
        dto.setDelayMinutes(d.getDelayMinutes());
        dto.setDelayReason(d.getDelayReason());
        dto.setUpdatedDepartureTime(d.getUpdatedDepartureTime());
        dto.setReportedBy(d.getReportedBy());
        dto.setReportedAt(d.getReportedAt());
        return dto;
    }
}
