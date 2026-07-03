package com.example.demo.repsitories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entities.JWTToken;

public interface JWTTokenRepository extends JpaRepository<JWTToken, Integer>{
	@Query("SELECT t FROM JWTToken t WHERE t.user.userId = :userId")
	JWTToken findByUserId(@Param("userId") Integer userId);
}
