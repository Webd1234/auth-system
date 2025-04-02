package com.example.auth.repository;




import com.example.auth.entity.Constituency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConstituencyRepository extends JpaRepository<Constituency, Long> {
}
