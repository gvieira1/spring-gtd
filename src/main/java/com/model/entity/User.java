package com.model.entity;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class User implements UserDetails{

    private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true) 
    private String email;

    @Column(nullable = false)
    private String password;
    
    @Column(name="moodle_user_id", unique = true)
    private Long moodleUserId;
    
    private Integer notificationDaysBeforeDefault;


	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(); 
	}
	
	@Override
	public String getUsername() {
	    return String.valueOf(this.id); 
	}


    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
	

    
}
